from datetime import datetime, timezone
import json
import os
import uuid

from fastapi import APIRouter, Depends, File, HTTPException, UploadFile
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.database import get_db
from app.dependencies import get_current_user, require_restaurant_owner
from app.models.restaurant import RestaurantProfile

router = APIRouter()

EDITABLE_STATUSES = {"draft", "rejected"}
REQUIRED_APPLY_FIELDS = (
    "restaurant_name",
    "owner_name",
    "phone",
    "address",
    "food_type",
    "account_holder",
    "account_number",
    "ifsc_code",
)
REQUIRED_DOC_FIELDS = ("fssai_url", "pan_url")


class ProfileUpdateRequest(BaseModel):
    restaurant_name: str | None = None
    owner_name: str | None = None
    email: str | None = None
    phone: str | None = None
    address: str | None = None
    city: str | None = None
    pincode: str | None = None
    cuisine_types: list[str] | None = None
    food_type: str | None = None
    cost_for_two: float | None = None
    opening_time: str | None = None
    closing_time: str | None = None
    fssai_url: str | None = None
    gst_url: str | None = None
    pan_url: str | None = None
    aadhaar_url: str | None = None
    restaurant_image: str | None = None
    account_holder: str | None = None
    account_number: str | None = None
    ifsc_code: str | None = None
    bank_name: str | None = None


def _utcnow() -> datetime:
    return datetime.now(timezone.utc).replace(tzinfo=None)


def _parse_cuisine_types(raw: str | None) -> list[str]:
    if not raw:
        return []
    try:
        parsed = json.loads(raw)
        if isinstance(parsed, list):
            return [str(x) for x in parsed]
    except (json.JSONDecodeError, TypeError):
        pass
    return [raw] if raw else []


def _serialize_profile(profile: RestaurantProfile) -> dict:
    cuisine = _parse_cuisine_types(profile.cuisine_types or profile.cuisine)
    return {
        "id": str(profile.id),
        "user_id": str(profile.user_id),
        "restaurant_name": profile.restaurant_name,
        "owner_name": profile.owner_name,
        "phone": profile.phone,
        "email": profile.email,
        "address": profile.address,
        "city": profile.city,
        "pincode": profile.pincode,
        "cuisine_types": cuisine,
        "food_type": profile.food_type,
        "cost_for_two": float(profile.cost_for_two) if profile.cost_for_two is not None else None,
        "opening_time": profile.opening_time,
        "closing_time": profile.closing_time,
        "fssai_url": profile.fssai_url or profile.fssai_certificate_url,
        "gst_url": profile.gst_url,
        "pan_url": profile.pan_url or profile.pan_card_url,
        "aadhaar_url": profile.aadhaar_url,
        "restaurant_image": profile.restaurant_image,
        "account_holder": profile.account_holder,
        "account_number": profile.account_number,
        "ifsc_code": profile.ifsc_code or profile.ifsc,
        "bank_name": profile.bank_name,
        "onboarding_completed": profile.onboarding_completed,
        "status": profile.status,
        "rejection_reason": profile.rejection_reason,
        "submitted_at": profile.submitted_at.isoformat() if profile.submitted_at else None,
        "approved_at": profile.approved_at.isoformat() if profile.approved_at else None,
        "created_at": profile.created_at.isoformat() if profile.created_at else None,
        "updated_at": profile.updated_at.isoformat() if profile.updated_at else None,
        "is_active": profile.is_active,
        "banner_image": profile.banner_image,
        "logo": profile.logo,
        "latitude": float(profile.latitude) if profile.latitude is not None else None,
        "longitude": float(profile.longitude) if profile.longitude is not None else None,
        "minimum_order": float(profile.minimum_order) if profile.minimum_order is not None else 0,
        "delivery_fee": float(profile.delivery_fee) if profile.delivery_fee is not None else 0,
        "delivery_radius_km": profile.delivery_radius_km,
        "is_open": profile.is_open,
        "rating": float(profile.rating) if profile.rating is not None else 4.0,
        "delivery_time": profile.delivery_time,
        "total_reviews": profile.total_reviews,
    }


def _get_or_create_draft(db: Session, user_uuid: uuid.UUID) -> RestaurantProfile:
    profile = (
        db.query(RestaurantProfile)
        .filter(RestaurantProfile.user_id == user_uuid)
        .first()
    )
    if profile:
        return profile

    profile = RestaurantProfile(
        user_id=user_uuid,
        status="draft",
        onboarding_completed=False,
        is_active=False,
    )
    db.add(profile)
    db.commit()
    db.refresh(profile)
    return profile


def _apply_profile_updates(profile: RestaurantProfile, data: ProfileUpdateRequest) -> None:
    payload = data.model_dump(exclude_unset=True)
    cuisine_types = payload.pop("cuisine_types", None)

    for key, value in payload.items():
        if value is not None:
            setattr(profile, key, value)

    if cuisine_types is not None:
        profile.cuisine_types = json.dumps(cuisine_types)
        profile.cuisine = profile.cuisine_types

    # Keep legacy mirrors in sync for existing consumers
    if profile.ifsc_code:
        profile.ifsc = profile.ifsc_code
    if profile.fssai_url:
        profile.fssai_certificate_url = profile.fssai_url
    if profile.pan_url:
        profile.pan_card_url = profile.pan_url

    profile.updated_at = _utcnow()


def _validation_errors(profile: RestaurantProfile) -> list[dict]:
    errors: list[dict] = []
    for field in REQUIRED_APPLY_FIELDS:
        if not getattr(profile, field, None):
            errors.append({"field": field, "message": f"{field} is required"})
    if not _parse_cuisine_types(profile.cuisine_types or profile.cuisine):
        errors.append({"field": "cuisine_types", "message": "At least one cuisine type is required"})
    for field in REQUIRED_DOC_FIELDS:
        value = getattr(profile, field, None)
        if field == "fssai_url" and not value:
            value = profile.fssai_certificate_url
        if field == "pan_url" and not value:
            value = profile.pan_card_url
        if not value:
            errors.append({"field": field, "message": f"{field} is required"})
    return errors


@router.get("/restaurant/profile")
def get_restaurant_profile(
    db: Session = Depends(get_db),
    user=Depends(get_current_user),
):
    user_uuid = uuid.UUID(user["user_id"])
    profile = _get_or_create_draft(db, user_uuid)
    return _serialize_profile(profile)


@router.put("/restaurant/profile")
def update_restaurant_profile(
    data: ProfileUpdateRequest,
    db: Session = Depends(get_db),
    user=Depends(get_current_user),
):
    user_uuid = uuid.UUID(user["user_id"])
    profile = _get_or_create_draft(db, user_uuid)

    if profile.status not in EDITABLE_STATUSES:
        raise HTTPException(
            status_code=409,
            detail=f"Profile cannot be edited while status is '{profile.status}'",
        )

    _apply_profile_updates(profile, data)
    db.commit()
    db.refresh(profile)
    return _serialize_profile(profile)


@router.post("/restaurant/apply")
def apply_restaurant(
    db: Session = Depends(get_db),
    user=Depends(get_current_user),
):
    user_uuid = uuid.UUID(user["user_id"])
    profile = _get_or_create_draft(db, user_uuid)

    if profile.status == "pending":
        raise HTTPException(status_code=409, detail="Application is already under review")
    if profile.status == "approved":
        raise HTTPException(status_code=409, detail="Restaurant is already approved")

    if profile.status not in EDITABLE_STATUSES:
        raise HTTPException(status_code=409, detail=f"Cannot apply while status is '{profile.status}'")

    errors = _validation_errors(profile)
    if errors:
        raise HTTPException(status_code=422, detail={"message": "Validation failed", "errors": errors})

    now = _utcnow()
    profile.status = "pending"
    profile.onboarding_completed = True
    profile.submitted_at = now
    profile.updated_at = now
    profile.rejection_reason = None
    profile.is_active = False

    db.commit()
    db.refresh(profile)
    return {"success": True, "status": profile.status, "submitted_at": profile.submitted_at.isoformat()}


@router.get("/restaurants")
def get_approved_restaurants(db: Session = Depends(get_db)):
    rows = (
        db.query(RestaurantProfile)
        .filter(
            RestaurantProfile.status == "approved",
            RestaurantProfile.is_active.is_(True),
        )
        .order_by(RestaurantProfile.created_at.desc())
        .all()
    )
    return [_serialize_profile(r) for r in rows]


@router.get("/restaurant/earnings")
def get_restaurant_earnings(
    db: Session = Depends(get_db),
    user=Depends(require_restaurant_owner),
):
    from sqlalchemy import text

    user_uuid = uuid.UUID(user["user_id"])
    profile = (
        db.query(RestaurantProfile)
        .filter(RestaurantProfile.user_id == user_uuid)
        .first()
    )
    if not profile:
        raise HTTPException(404, "Restaurant profile not found")
    if profile.status != "approved" or not profile.is_active:
        raise HTTPException(403, "Restaurant must be approved and active")

    result = db.execute(
        text(
            """
        SELECT
            COALESCE(SUM(CAST(o.total_amount AS NUMERIC)), 0) as total_earnings,
            COUNT(CASE WHEN o.payment_status = 'PAID' THEN 1 END) as paid_orders,
            COUNT(*) as total_orders
        FROM orders o
        WHERE o.restaurant_id = :restaurant_id
        AND o.payment_status = 'PAID'
    """
        ),
        {"restaurant_id": str(profile.id)},
    ).first()

    total_earnings, paid_orders, total_orders = result
    return {
        "restaurant_id": str(profile.id),
        "total_earnings": float(total_earnings),
        "paid_orders": paid_orders or 0,
        "total_orders": total_orders or 0,
    }


@router.get("/restaurant/earnings/analytics")
def get_restaurant_earnings_analytics(
    db: Session = Depends(get_db),
    user=Depends(require_restaurant_owner),
):
    from sqlalchemy import text

    user_uuid = uuid.UUID(user["user_id"])
    profile = (
        db.query(RestaurantProfile)
        .filter(RestaurantProfile.user_id == user_uuid)
        .first()
    )
    if not profile:
        raise HTTPException(404, "Restaurant profile not found")
    if profile.status != "approved" or not profile.is_active:
        raise HTTPException(403, "Restaurant must be approved and active")

    data = db.execute(
        text(
            """
        SELECT DATE(o.created_at) as date,
               COUNT(*) as orders,
               COALESCE(SUM(CAST(o.total_amount AS NUMERIC)), 0) as revenue
        FROM orders o
        WHERE o.restaurant_id = :restaurant_id
        AND o.payment_status = 'PAID'
        GROUP BY DATE(o.created_at)
        ORDER BY date ASC
    """
        ),
        {"restaurant_id": str(profile.id)},
    ).fetchall()

    return {
        "restaurant_id": str(profile.id),
        "earningsTrend": [
            {"date": row[0], "orders": row[1], "revenue": float(row[2])} for row in data
        ],
    }


@router.get("/partner/dashboard/earnings")
def get_partner_dashboard_earnings(
    db: Session = Depends(get_db),
    user=Depends(require_restaurant_owner),
):
    from sqlalchemy import text
    import logging

    profile = (
        db.query(RestaurantProfile)
        .filter(RestaurantProfile.user_id == uuid.UUID(user["user_id"]))
        .first()
    )
    if not profile:
        raise HTTPException(404, "Restaurant profile not found")
    if profile.status != "approved" or not profile.is_active:
        raise HTTPException(403, "Restaurant must be approved and active")

    logged_in_user_id = user["user_id"]
    log = logging.getLogger(__name__)
    log.info("EARNINGS_DEBUG: current_user=%s", user)

    total_earnings_result = db.execute(
        text(
            """
        SELECT COALESCE(SUM(p.amount), 0) AS total_earnings
        FROM payments p
        JOIN orders o ON p.order_id = o.id
        JOIN restaurant_profiles rp ON o.restaurant_id = rp.id
        WHERE rp.user_id = :logged_in_user_id AND p.payment_status = 'PAID'
    """
        ),
        {"logged_in_user_id": logged_in_user_id},
    ).first()

    weekly_earnings_result = db.execute(
        text(
            """
        SELECT COALESCE(SUM(p.amount), 0) AS weekly_earnings
        FROM payments p
        JOIN orders o ON p.order_id = o.id
        JOIN restaurant_profiles rp ON o.restaurant_id = rp.id
        WHERE rp.user_id = :logged_in_user_id
          AND p.payment_status = 'PAID'
          AND p.created_at >= NOW() - INTERVAL '7 days'
    """
        ),
        {"logged_in_user_id": logged_in_user_id},
    ).first()

    monthly_earnings_result = db.execute(
        text(
            """
        SELECT COALESCE(SUM(p.amount), 0) AS monthly_earnings
        FROM payments p
        JOIN orders o ON p.order_id = o.id
        JOIN restaurant_profiles rp ON o.restaurant_id = rp.id
        WHERE rp.user_id = :logged_in_user_id
          AND p.payment_status = 'PAID'
          AND DATE_TRUNC('month', p.created_at) = DATE_TRUNC('month', NOW())
    """
        ),
        {"logged_in_user_id": logged_in_user_id},
    ).first()

    pending_amount_result = db.execute(
        text(
            """
        SELECT COALESCE(SUM(p.amount), 0) AS pending_amount
        FROM payments p
        JOIN orders o ON p.order_id = o.id
        JOIN restaurant_profiles rp ON o.restaurant_id = rp.id
        WHERE rp.user_id = :logged_in_user_id AND p.payment_status = 'PENDING'
    """
        ),
        {"logged_in_user_id": logged_in_user_id},
    ).first()

    weekly_chart_result = db.execute(
        text(
            """
        SELECT TO_CHAR(p.created_at, 'Dy') AS day, SUM(p.amount) AS total
        FROM payments p
        JOIN orders o ON p.order_id = o.id
        JOIN restaurant_profiles rp ON o.restaurant_id = rp.id
        WHERE rp.user_id = :logged_in_user_id
          AND p.payment_status = 'PAID'
          AND p.created_at >= NOW() - INTERVAL '7 days'
        GROUP BY DATE(p.created_at), day
        ORDER BY DATE(p.created_at)
    """
        ),
        {"logged_in_user_id": logged_in_user_id},
    ).fetchall()

    transactions_result = db.execute(
        text(
            """
        SELECT p.payment_id, p.amount, p.payment_status, p.created_at, o.order_number
        FROM payments p
        JOIN orders o ON p.order_id = o.id
        JOIN restaurant_profiles rp ON o.restaurant_id = rp.id
        WHERE rp.user_id = :logged_in_user_id
        ORDER BY p.created_at DESC
        LIMIT 10
    """
        ),
        {"logged_in_user_id": logged_in_user_id},
    ).fetchall()

    return {
        "weekly_earnings": float(weekly_earnings_result[0]) if weekly_earnings_result and weekly_earnings_result[0] else 0.0,
        "monthly_earnings": float(monthly_earnings_result[0]) if monthly_earnings_result and monthly_earnings_result[0] else 0.0,
        "pending_amount": float(pending_amount_result[0]) if pending_amount_result and pending_amount_result[0] else 0.0,
        "weekly_chart": [
            {"day": row[0], "amount": float(row[1]) if row[1] else 0.0} for row in weekly_chart_result
        ],
        "transactions": [
            {
                "payment_id": row[0],
                "order_number": row[4],
                "amount": float(row[1]),
                "payment_status": row[2],
            }
            for row in transactions_result
        ],
    }


@router.post("/restaurant/upload-document")
async def upload_document(
    file: UploadFile = File(...),
    doc_type: str | None = None,
):
    allowed_extensions = {".pdf", ".jpg", ".jpeg", ".png"}
    file_ext = os.path.splitext(file.filename or "")[1].lower()
    if file_ext not in allowed_extensions:
        raise HTTPException(
            400,
            f"File type {file_ext} not allowed. Allowed: {', '.join(sorted(allowed_extensions))}",
        )

    max_size = 5 * 1024 * 1024
    file_content = await file.read()
    if len(file_content) > max_size:
        raise HTTPException(400, "File size exceeds 5MB limit")

    upload_dir = "uploads/documents"
    os.makedirs(upload_dir, exist_ok=True)
    unique_filename = f"{uuid.uuid4()}{file_ext}"
    file_path = os.path.join(upload_dir, unique_filename)
    with open(file_path, "wb") as f:
        f.write(file_content)

    return {
        "success": True,
        "file_url": f"/uploads/documents/{unique_filename}",
        "filename": file.filename,
        "doc_type": doc_type,
    }

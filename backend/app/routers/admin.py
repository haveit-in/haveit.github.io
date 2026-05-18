from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.database import get_db
from app.dependencies import get_current_user, require_admin
from app.models.restaurant import RestaurantProfile
from app.models.user import User
from app.routers.restaurant import _serialize_profile

router = APIRouter()


class RejectRequest(BaseModel):
    reason: str


def _admin_user_id(user: dict):
    raw = user.get("user_id") or user.get("id")
    return raw


@router.get("/admin/restaurants")
def get_restaurants(
    status: str | None = None,
    db: Session = Depends(get_db),
    user=Depends(require_admin),
):
    query = db.query(RestaurantProfile)
    if status:
        allowed = {"pending", "approved", "rejected", "draft"}
        if status not in allowed:
            raise HTTPException(400, detail=f"Invalid status. Allowed: {', '.join(sorted(allowed))}")
        query = query.filter(RestaurantProfile.status == status)

    restaurants = query.order_by(RestaurantProfile.submitted_at.desc().nullslast(), RestaurantProfile.created_at.desc()).all()
    return [_serialize_profile(r) for r in restaurants]


@router.post("/admin/restaurants/{id}/approve")
def approve_restaurant(
    id: int,
    db: Session = Depends(get_db),
    user=Depends(require_admin),
):
    profile = db.query(RestaurantProfile).filter(RestaurantProfile.id == id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Restaurant not found")
    if profile.status != "pending":
        raise HTTPException(status_code=400, detail="Application already processed")

    profile.status = "approved"
    profile.is_active = True
    profile.approved_at = datetime.utcnow()
    profile.rejection_reason = None

    user_obj = db.query(User).filter(User.id == profile.user_id).first()
    if not user_obj:
        raise HTTPException(status_code=404, detail="User not found")
    if user_obj.role != "restaurant_owner":
        user_obj.role = "restaurant_owner"

    admin_id = _admin_user_id(user)
    if admin_id:
        try:
            from uuid import UUID

            profile.approved_by = UUID(str(admin_id))
        except (ValueError, TypeError):
            pass

    db.commit()
    return {"message": "Restaurant approved successfully"}


@router.post("/admin/restaurants/{id}/reject")
def reject_restaurant(
    id: int,
    request: RejectRequest,
    db: Session = Depends(get_db),
    user=Depends(require_admin),
):
    reason = (request.reason or "").strip()
    if not reason:
        raise HTTPException(status_code=422, detail="Rejection reason is required")

    profile = db.query(RestaurantProfile).filter(RestaurantProfile.id == id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Restaurant not found")
    if profile.status != "pending":
        raise HTTPException(status_code=400, detail="Application already processed")

    profile.status = "rejected"
    profile.rejection_reason = reason
    profile.is_active = False
    db.commit()
    return {"message": "Restaurant rejected successfully"}


@router.get("/admin/dashboard")
def admin_dashboard(
    db: Session = Depends(get_db),
    user=Depends(require_admin),
):
    from sqlalchemy import text

    users = db.query(User).count()
    restaurants = db.query(RestaurantProfile).filter(RestaurantProfile.status == "approved").count()
    pending = db.query(RestaurantProfile).filter(RestaurantProfile.status == "pending").count()
    orders = db.execute(text("SELECT COUNT(*) FROM orders")).scalar()

    return {
        "totalUsers": users,
        "totalRestaurants": restaurants,
        "pendingRestaurants": pending,
        "totalOrders": orders,
    }


@router.get("/admin/users")
def admin_users(
    db: Session = Depends(get_db),
    user=Depends(require_admin),
):
    users = db.query(User).order_by(User.id.desc()).all()
    return [
        {
            "id": str(user_record.id),
            "email": user_record.email,
            "role": user_record.role or "user",
            "created_at": None,
        }
        for user_record in users
    ]


@router.get("/admin/orders")
def admin_orders(
    db: Session = Depends(get_db),
    user=Depends(require_admin),
):
    from sqlalchemy import text

    rows = db.execute(
        text(
            """
        SELECT
            o.id, o.order_number, o.user_id, o.restaurant_id,
            o.subtotal, o.tax_amount, o.delivery_fee, o.total_amount,
            o.payment_method, o.payment_status, o.order_status,
            o.delivery_address, o.customer_lat, o.customer_lng,
            o.estimated_delivery_time, o.created_at, o.updated_at,
            u.email as user_email, u.name as user_name, u.phone as user_phone,
            u.photo_url as user_photo, u.role as user_role,
            r.restaurant_name, r.owner_name as restaurant_owner, r.phone as restaurant_phone,
            r.address as restaurant_address, r.city as restaurant_city,
            COALESCE(r.cuisine_types, r.cuisine) as cuisine,
            r.logo as restaurant_logo, r.rating as restaurant_rating,
            r.delivery_fee as restaurant_delivery_fee, r.delivery_time as restaurant_delivery_time,
            (SELECT COUNT(*) FROM order_items WHERE order_id = o.id) as items_count,
            (SELECT JSON_AGG(
                JSON_BUILD_OBJECT(
                    'item_name', item_name,
                    'quantity', quantity,
                    'price', price,
                    'total_price', total_price
                )
            ) FROM order_items WHERE order_id = o.id) as order_items
        FROM orders o
        LEFT JOIN users u ON u.id = o.user_id
        LEFT JOIN restaurant_profiles r ON r.id = o.restaurant_id
        ORDER BY o.created_at DESC
        LIMIT 100
    """
        )
    ).fetchall()

    result = []
    for row in rows:
        result.append(
            {
                "id": str(row[0]),
                "order_number": row[1],
                "user_id": str(row[2]) if row[2] else None,
                "restaurant_id": str(row[3]) if row[3] else None,
                "subtotal": float(row[4]) if row[4] else 0,
                "tax_amount": float(row[5]) if row[5] else 0,
                "delivery_fee": float(row[6]) if row[6] else 0,
                "total_amount": float(row[7]) if row[7] else 0,
                "payment_method": row[8],
                "payment_status": row[9],
                "order_status": row[10],
                "delivery_address": row[11],
                "customer_lat": float(row[12]) if row[12] else None,
                "customer_lng": float(row[13]) if row[13] else None,
                "estimated_delivery_time": row[14],
                "created_at": row[15],
                "updated_at": row[16],
                "user_email": row[17],
                "user_name": row[18],
                "user_phone": row[19],
                "user_photo": row[20],
                "user_role": row[21],
                "restaurant_name": row[22],
                "restaurant_owner": row[23],
                "restaurant_phone": row[24],
                "restaurant_address": row[25],
                "restaurant_city": row[26],
                "restaurant_cuisine": row[27],
                "restaurant_logo": row[28],
                "restaurant_rating": float(row[29]) if row[29] else None,
                "restaurant_delivery_fee": float(row[30]) if row[30] else None,
                "restaurant_delivery_time": row[31],
                "items_count": row[32],
                "order_items": row[33] if row[33] else [],
                "customer": row[18] or row[17] or "Unknown Customer",
                "restaurant": row[22] or "Unknown Restaurant",
                "items": row[32] or 0,
                "amount": f"${float(row[7]) if row[7] else 0:.2f}",
                "status": row[10],
                "phone": row[19] or row[24] or "No phone",
                "address": row[11] or "No address",
                "time": f"{(datetime.utcnow() - row[15]).total_seconds() / 60:.0f} mins ago" if row[15] else "",
            }
        )
    return result


@router.get("/admin/analytics")
def admin_analytics(
    db: Session = Depends(get_db),
    user=Depends(require_admin),
):
    from sqlalchemy import text

    data = db.execute(
        text(
            """
        SELECT DATE(o.created_at) as date,
               COUNT(*) as orders,
               SUM(CAST(o.total_amount AS NUMERIC)) as revenue
        FROM orders o
        WHERE o.payment_status = 'PAID'
        GROUP BY DATE(o.created_at)
        ORDER BY date ASC
    """
        )
    ).fetchall()

    return {
        "ordersTrend": [
            {"date": row[0], "orders": row[1], "revenue": float(row[2]) if row[2] else 0}
            for row in data
        ]
    }


@router.post("/admin/setup")
def create_admin_user(
    email: str,
    db: Session = Depends(get_db),
    user=Depends(get_current_user),
):
    existing_user = db.query(User).filter(User.email == email).first()
    if not existing_user:
        raise HTTPException(404, "User not found")
    if existing_user.role == "admin":
        raise HTTPException(400, "User is already an admin")
    existing_user.role = "admin"
    db.commit()
    return {"message": "Admin user created successfully"}

"""restaurant onboarding workflow columns

Revision ID: c4a8b9d0e1f2
Revises: d107e8031619
Create Date: 2026-05-18

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = "c4a8b9d0e1f2"
down_revision: Union[str, None] = "d107e8031619"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def _column_names(table: str) -> set[str]:
    bind = op.get_bind()
    insp = sa.inspect(bind)
    return {c["name"] for c in insp.get_columns(table)}


def _status_udt_name() -> str | None:
    bind = op.get_bind()
    row = bind.execute(
        sa.text(
            """
            SELECT udt_name
            FROM information_schema.columns
            WHERE table_schema = 'public'
              AND table_name = 'restaurant_profiles'
              AND column_name = 'status'
            """
        )
    ).fetchone()
    return row[0] if row else None


def upgrade() -> None:
    cols = _column_names("restaurant_profiles")

    def add(name: str, col: sa.Column) -> None:
        nonlocal cols
        if name not in cols:
            op.add_column("restaurant_profiles", col)
            cols = _column_names("restaurant_profiles")

    # All ORM onboarding columns (idempotent)
    add("pincode", sa.Column("pincode", sa.String(), nullable=True))
    add("cuisine_types", sa.Column("cuisine_types", sa.Text(), nullable=True))
    add("food_type", sa.Column("food_type", sa.String(length=20), nullable=True))
    add("cost_for_two", sa.Column("cost_for_two", sa.Numeric(10, 2), nullable=True))
    add("opening_time", sa.Column("opening_time", sa.String(length=10), nullable=True))
    add("closing_time", sa.Column("closing_time", sa.String(length=10), nullable=True))
    add("fssai_url", sa.Column("fssai_url", sa.Text(), nullable=True))
    add("gst_url", sa.Column("gst_url", sa.Text(), nullable=True))
    add("pan_url", sa.Column("pan_url", sa.Text(), nullable=True))
    add("aadhaar_url", sa.Column("aadhaar_url", sa.Text(), nullable=True))
    add("restaurant_image", sa.Column("restaurant_image", sa.Text(), nullable=True))
    add("ifsc_code", sa.Column("ifsc_code", sa.String(), nullable=True))
    add("bank_name", sa.Column("bank_name", sa.String(), nullable=True))
    add(
        "onboarding_completed",
        sa.Column("onboarding_completed", sa.Boolean(), server_default=sa.false(), nullable=False),
    )
    add("submitted_at", sa.Column("submitted_at", sa.DateTime(), nullable=True))
    add("updated_at", sa.Column("updated_at", sa.DateTime(), server_default=sa.text("now()"), nullable=True))
    add("rejection_reason", sa.Column("rejection_reason", sa.Text(), nullable=True))

    # Relax NOT NULL on draft-friendly columns
    cols = _column_names("restaurant_profiles")
    for col_name in (
        "restaurant_name",
        "owner_name",
        "email",
        "phone",
        "address",
        "city",
        "cuisine",
        "fssai",
        "account_number",
        "ifsc",
        "account_holder",
    ):
        if col_name in cols:
            op.alter_column("restaurant_profiles", col_name, nullable=True)

    # status must be VARCHAR for draft/pending/approved/rejected workflow
    if _status_udt_name() == "restaurant_status":
        op.execute(
            """
            ALTER TABLE restaurant_profiles
            ALTER COLUMN status TYPE VARCHAR
            USING status::text
            """
        )

    cols = _column_names("restaurant_profiles")
    set_clauses: list[str] = []
    if "cuisine_types" in cols and "cuisine" in cols:
        set_clauses.append("cuisine_types = COALESCE(cuisine_types, cuisine)")
    if "fssai_url" in cols and "fssai_certificate_url" in cols:
        set_clauses.append("fssai_url = COALESCE(fssai_url, fssai_certificate_url)")
    if "pan_url" in cols and "pan_card_url" in cols:
        set_clauses.append("pan_url = COALESCE(pan_url, pan_card_url)")
    if "ifsc_code" in cols and "ifsc" in cols:
        set_clauses.append("ifsc_code = COALESCE(ifsc_code, ifsc)")
    if "restaurant_image" in cols and "restaurant_images_urls" in cols:
        set_clauses.append(
            """restaurant_image = COALESCE(
                restaurant_image,
                CASE
                    WHEN restaurant_images_urls IS NOT NULL
                         AND restaurant_images_urls LIKE '[%'
                    THEN (restaurant_images_urls::json->>0)
                    ELSE restaurant_images_urls
                END
            )"""
        )

    if set_clauses:
        op.execute(
            f"""
            UPDATE restaurant_profiles
            SET {", ".join(set_clauses)}
            """
        )

    # Only NULL status -> draft (do not compare enum/varchar to '')
    op.execute(
        """
        UPDATE restaurant_profiles
        SET status = 'draft'
        WHERE status IS NULL
        """
    )

    if "onboarding_completed" in cols:
        op.execute(
            """
            UPDATE restaurant_profiles
            SET onboarding_completed = TRUE
            WHERE status IN ('pending', 'approved', 'rejected')
              AND onboarding_completed = FALSE
            """
        )

    if "submitted_at" in cols:
        op.execute(
            """
            UPDATE restaurant_profiles
            SET submitted_at = created_at
            WHERE status IN ('pending', 'approved', 'rejected')
              AND submitted_at IS NULL
              AND created_at IS NOT NULL
            """
        )

    op.alter_column(
        "restaurant_profiles",
        "status",
        server_default="draft",
        existing_type=sa.String(),
    )


def downgrade() -> None:
    cols = _column_names("restaurant_profiles")
    for name in (
        "pincode",
        "cuisine_types",
        "fssai_url",
        "gst_url",
        "pan_url",
        "aadhaar_url",
        "restaurant_image",
        "ifsc_code",
        "bank_name",
        "onboarding_completed",
        "submitted_at",
        "updated_at",
    ):
        if name in cols:
            op.drop_column("restaurant_profiles", name)

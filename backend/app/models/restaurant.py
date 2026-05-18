# app/models/restaurant.py

from sqlalchemy import Column, Integer, String, ForeignKey, Boolean, DateTime, Text, func, Numeric
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from .user import Base


class RestaurantProfile(Base):
    __tablename__ = "restaurant_profiles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False, unique=True)

    restaurant_name = Column(String, nullable=True)
    owner_name = Column(String, nullable=True)
    phone = Column(String, nullable=True)
    email = Column(String, nullable=True)
    address = Column(String, nullable=True)
    city = Column(String, nullable=True)
    pincode = Column(String, nullable=True)

    cuisine_types = Column(Text, nullable=True)  # JSON array string
    food_type = Column(String(20), nullable=True)  # veg, non-veg, both
    cost_for_two = Column(Numeric(10, 2), nullable=True)
    opening_time = Column(String(10), nullable=True)
    closing_time = Column(String(10), nullable=True)

    fssai_url = Column(Text, nullable=True)
    gst_url = Column(Text, nullable=True)
    pan_url = Column(Text, nullable=True)
    aadhaar_url = Column(Text, nullable=True)
    restaurant_image = Column(Text, nullable=True)

    account_holder = Column(String, nullable=True)
    account_number = Column(String, nullable=True)
    ifsc_code = Column(String, nullable=True)
    bank_name = Column(String, nullable=True)

    onboarding_completed = Column(Boolean, default=False, nullable=False)
    status = Column(String, default="draft", nullable=False)  # draft, pending, approved, rejected
    rejection_reason = Column(Text, nullable=True)
    submitted_at = Column(DateTime, nullable=True)
    approved_at = Column(DateTime, nullable=True)
    approved_by = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=True)
    is_active = Column(Boolean, default=False, nullable=False)

    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())

    # Legacy / operational fields (customer listing, menu, orders)
    cuisine = Column(String, nullable=True)  # deprecated alias; kept for backward compatibility
    fssai = Column(String, nullable=True)
    ifsc = Column(String, nullable=True)
    fssai_certificate_url = Column(Text, nullable=True)
    pan_card_url = Column(Text, nullable=True)
    bank_proof_url = Column(Text, nullable=True)
    restaurant_images_urls = Column(Text, nullable=True)
    menu_url = Column(Text, nullable=True)

    banner_image = Column(Text, nullable=True)
    logo = Column(Text, nullable=True)
    latitude = Column(Numeric(10, 8), nullable=True)
    longitude = Column(Numeric(11, 8), nullable=True)
    minimum_order = Column(Numeric(10, 2), default=0)
    delivery_fee = Column(Numeric(10, 2), default=0)
    delivery_radius_km = Column(Integer, default=5)
    is_open = Column(Boolean, default=True)
    rating = Column(Numeric(2, 1), default=4.0)
    delivery_time = Column(String(50), nullable=True)
    total_reviews = Column(Integer, default=0)

    user = relationship("User", foreign_keys=[user_id])
    approver = relationship("User", foreign_keys=[approved_by])
    orders = relationship("Order", back_populates="restaurant")
    menu_items = relationship("MenuItem", back_populates="restaurant")
    menu_categories = relationship("MenuCategory", back_populates="restaurant")

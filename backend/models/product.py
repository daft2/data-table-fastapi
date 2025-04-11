from sqlalchemy import Column, Integer, String, Float, DateTime
from db.base import Base
from datetime import datetime

class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)
    sku = Column(String, unique=True, index=True)
    name = Column(String, index=True)
    category = Column(String)
    price = Column(Float)
    status = Column(String)  # e.g. low stock, in stock, out of stock
    brand = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    weight = Column(Float)
    dimension = Column(String)
    color = Column(String)
    image_url = Column(String)

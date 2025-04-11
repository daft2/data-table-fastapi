from pydantic import BaseModel
from datetime import datetime

class ProductBase(BaseModel):
    id: int
    name: str
    category: str
    price: float
    status: str

    class Config:
        orm_mode = True

class ProductDetail(ProductBase):
    sku: str
    brand: str
    created_at: datetime
    updated_at: datetime
    weight: float
    dimension: str
    color: str
    image_url: str

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from db.session import get_db
from models.product import Product
from schemas.product import ProductBase, ProductDetail
from typing import List

router = APIRouter()

@router.get("/", response_model=List[ProductBase])
def get_products(skip: int = 0, limit: int = 50, db: Session = Depends(get_db)):
    return db.query(Product).offset(skip).limit(limit).all()

@router.get("/{product_id}", response_model=ProductDetail)
def get_product_detail(product_id: int, db: Session = Depends(get_db)):
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product

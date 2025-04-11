from db.base import Base
from db.session import engine
from models.product import Product

Base.metadata.create_all(bind=engine)
print("Database created successfully.")
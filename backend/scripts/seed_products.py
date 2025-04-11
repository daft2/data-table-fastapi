from faker import Faker
from random import choice, randint, uniform
from sqlalchemy.orm import Session
from db.session import SessionLocal
from models.product import Product

fake = Faker()
db = SessionLocal()

statuses = ['low stock', 'in stock', 'out of stock']
brands = ['Sony', 'Samsung', 'Apple', 'Dell', 'Asus', 'HP', 'LG']
categories = ['Electronics', 'Clothing', 'Home', 'Beauty', 'Toys', 'Books', 'Fitness']
colors = ['Red', 'Blue', 'Green', 'Black', 'White', 'Gray', 'Yellow']

def seed_products(n=100_000):
    product_count = db.query(Product).count()
    if product_count >= n:
        print(f"✅ Database already contains {product_count} products. No seeding required.")
        db.close()
        return

    batch = []
    for _ in range(n - product_count):
        product = Product(
            sku=fake.unique.ean13(),
            name=fake.word().capitalize() + " " + fake.word().capitalize(),
            category=choice(categories),
            price=round(uniform(10.0, 1000.0), 2),
            status=choice(statuses),
            brand=choice(brands),
            weight=round(uniform(0.1, 5.0), 2),
            dimension=f"{randint(5, 100)}x{randint(5, 100)}x{randint(1, 50)} cm",
            color=choice(colors),
            image_url=fake.image_url()
        )
        batch.append(product)
        if len(batch) >= 1000:
            db.bulk_save_objects(batch)
            db.commit()
            batch = []
    if batch:
        db.bulk_save_objects(batch)
        db.commit()

    db.close()
    print(f"✅ Seeded {n - product_count} products.")

if __name__ == "__main__":
    seed_products()

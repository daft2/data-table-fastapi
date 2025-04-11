#!/bin/sh

echo "🕐 Waiting for DB..."
sleep 5

echo "⚙️ Running DB creation..."
python scripts/create_db.py

echo "🌱 Seeding products..."
python scripts/seed_products.py

echo "🚀 Starting backend..."
uvicorn main:app --host 0.0.0.0 --port 8000

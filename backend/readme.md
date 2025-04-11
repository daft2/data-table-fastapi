# Backend Service

A REST API service built with FastAPI and SQLAlchemy for managing product data.

## Technologies

- Python 3.11
- FastAPI
- SQLAlchemy
- uvicorn

## Getting Started

### Prerequisites

- Python 3.11 or higher
- pip (Python package manager)

### Installation

1. Clone the repository
2. Navigate to the backend directory
3. Install dependencies:
```bash
pip install -r requirements.txt
```

### Running the Application

You can run the application in two ways:

#### Using Python directly
```bash
uvicorn main:app --host 0.0.0.0 --port 8000
```

#### Using Docker
```bash
docker build -t backend-service -f Dockerfile.backend .
docker run -p 8000:8000 backend-service
```

## API Endpoints

### Products

- `GET /products/`
  - Retrieves a list of products
  - Query parameters:
    - `skip` (optional): Number of records to skip (default: 0)
    - `limit` (optional): Maximum number of records to return (default: 50)

- `GET /products/{product_id}`
  - Retrieves detailed information about a specific product
  - Parameters:
    - `product_id`: The ID of the product

## Environment Configuration

The service expects to run on port 8000 and is configured to be accessed via `http://backend:8000` from the frontend service.

## Development

The project follows a modular structure:
- `api/` - API route definitions
- `db/` - Database configuration and session management
- `models/` - SQLAlchemy models
- `schemas/` - Pydantic schemas for request/response validation

## Error Handling

The API implements standard HTTP status codes:
- 200: Successful request
- 404: Resource not found
- 500: Internal server error
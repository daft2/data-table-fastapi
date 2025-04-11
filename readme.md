# Full Stack Product Management Application

A modern web application for managing product data, built with Next.js frontend and FastAPI backend.

## Architecture

The application consists of three main components:
- Frontend: Next.js 14 application with TypeScript and Tailwind CSS
- Backend: FastAPI REST API service with SQLAlchemy
- Database: PostgreSQL 15

## Prerequisites

- Docker and Docker Compose
- Node.js 18+ (for local frontend development)
- Python 3.11+ (for local backend development)
- pnpm/npm/yarn (for frontend package management)
- pip (for backend package management)

## Quick Start

### Using Docker Compose

1. Clone the repository
2. Start all services:
```bash
docker-compose up -d
```

The services will be available at:
- Frontend: http://localhost:3000
- Backend: http://localhost:8000
- Database: localhost:5432

### Local Development

#### Backend
1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Run the development server:
```bash
uvicorn main:app --reload
```

#### Frontend
1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
pnpm install
```

3. Run the development server:
```bash
pnpm dev
```

## Project Structure

```
.
├── backend/                # FastAPI backend service
│   ├── api/               # API route definitions
│   ├── db/               # Database configuration
│   ├── models/           # SQLAlchemy models
│   ├── schemas/          # Pydantic schemas
│   └── main.py          # Application entry point
├── frontend/             # Next.js frontend application
│   ├── app/             # Next.js app directory
│   ├── components/      # React components
│   ├── lib/            # Utility functions
│   └── styles/         # Global styles
├── Dockerfile.backend   # Backend Docker configuration
├── Dockerfile.frontend  # Frontend Docker configuration
└── docker-compose.yml  # Docker Compose configuration
```

## API Documentation

### Backend Endpoints

- `GET /products/`
  - Retrieves a list of products
  - Query parameters:
    - `skip` (optional): Number of records to skip (default: 0)
    - `limit` (optional): Maximum number of records to return (default: 50)

- `GET /products/{product_id}`
  - Retrieves detailed information about a specific product

## Frontend Features

- Product listing with virtual scrolling
- Product details view
- Search and filtering
- Responsive design
- Server-side rendering
- API integration

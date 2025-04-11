# Frontend Application

A modern web application built with Next.js, TypeScript, and Tailwind CSS for displaying and managing product data.

## Technologies

- Next.js 14
- TypeScript
- Tailwind CSS
- Shadcn UI Components
- TanStack Virtual
- React Query

## Prerequisites

- Node.js 18 or higher
- npm/pnpm/yarn

## Getting Started

### Installation

1. Clone the repository
2. Navigate to the frontend directory
3. Install dependencies:
```bash
pnpm install
# or
npm install
# or
yarn install
```

### Development

Run the development server:
```bash
pnpm dev
# or
npm run dev
# or
yarn dev
```

The application will be available at `http://localhost:3000`

### Building for Production

```bash
pnpm build
# or
npm run build
# or
yarn build
```

## Project Structure

```
├── app/                 # Next.js app directory
│   ├── items/          # Product items pages
│   ├── layout.tsx      # Root layout
│   └── page.tsx        # Home page
├── components/         # React components
│   ├── data-table.tsx  # Table component
│   ├── item-details.tsx # Product details
│   └── ui/            # Shared UI components
├── lib/               # Utility functions
├── styles/           # Global styles
└── public/           # Static assets
```

## Features

- Product listing with virtual scrolling
- Product details view
- Search and filtering
- Responsive design
- Server-side rendering
- API integration

## Development Guidelines

- Follow the established project structure
- Use TypeScript for all new code
- Follow the component design patterns used in the project
- Utilize existing UI components from the components/ui directory

## Available Scripts

- `dev`: Start development server
- `build`: Build for production
- `start`: Run production build
- `lint`: Run ESLint
- `type-check`: Run TypeScript compiler check
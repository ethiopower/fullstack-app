# Online Store Application

A full-stack e-commerce application with order management, tracking, and back office functionality.

## Project Structure

- `backend/` - Node.js/Express backend API
- `frontend/` - Next.js frontend application
- `shared/` - Shared TypeScript types and utilities

## Features

- User authentication and authorization
- Product catalog and management
- Shopping cart functionality
- Order processing and tracking
- Back office dashboard
- Real-time order updates

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- MongoDB
- Git

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd fullstack-app
```

2. Install dependencies:
```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install

# Install shared dependencies
cd ../shared
npm install
```

3. Set up environment variables:
```bash
# Backend (.env)
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
PORT=3001

# Frontend (.env.local)
NEXT_PUBLIC_API_URL=http://localhost:3001
```

4. Build shared package:
```bash
cd shared
npm run build
```

5. Start the development servers:
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001

## Development

- Backend API documentation is available at `/api-docs`
- Use `npm run build` to create production builds
- Use `npm run test` to run tests

## License

MIT 
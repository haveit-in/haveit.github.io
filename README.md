# HaveIt 🛒

**Food. Groceries. Haveit - all in one click.**

A full-stack food delivery and grocery e-commerce platform that connects users with restaurants and grocery stores. Built with modern technologies for fast, reliable service.

---

## 📋 Project Overview

HaveIt is a complete food delivery and grocery ordering application featuring:
- **User Authentication** with Firebase
- **Restaurant Management** with order tracking
- **Real-time Order Management** with status updates
- **Payment Integration** with Razorpay
- **Cart Management** with dynamic calculations
- **Admin Dashboard** for restaurant operations
- **Search & Discovery** with Fuse.js
- **Data Persistence** with PostgreSQL and SQLAlchemy

---

## 🏗️ Architecture

```
haveit-in.github.io/
├── frontend/                 # React + Vite SPA
│   ├── src/
│   │   ├── components/      # Reusable React components
│   │   ├── pages/           # Page components
│   │   ├── context/         # Context API state management
│   │   ├── hooks/           # Custom React hooks
│   │   └── utils/           # Utility functions
│   └── package.json
│
└── backend/                  # Python FastAPI REST API
    ├── app/
    │   ├── routers/         # API endpoint handlers
    │   ├── models/          # SQLAlchemy ORM models
    │   ├── schemas/         # Pydantic request/response schemas
    │   ├── middleware/      # Rate limiting, validation
    │   ├── utils/           # Helper functions
    │   └── websocket/       # WebSocket handlers
    ├── alembic/             # Database migrations
    └── tests/               # Test suite
```

---

## 🚀 Quick Start

### Backend (FastAPI + Python)

**Prerequisites:** Python 3.11+, PostgreSQL

```bash
cd backend

# Create virtual environment
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Set up database migrations
alembic upgrade head

# Run the server
uvicorn app.main:app --reload
```

**Server runs on:** `http://localhost:8000`  
**API Docs:** `http://localhost:8000/docs` (Swagger UI)

**Environment Variables** (create `.env`):
```env
DATABASE_URL=postgresql://user:password@localhost/haveit_db
FIREBASE_PROJECT_ID=your_firebase_project
FIREBASE_PRIVATE_KEY=your_firebase_key
FIREBASE_CLIENT_EMAIL=your_firebase_email
```

**Key Features:**
- ✅ Order management with status tracking
- ✅ Payment processing integration
- ✅ Restaurant order workflows
- ✅ Rate limiting middleware
- ✅ JWT-based authentication
- ✅ WebSocket support for real-time updates

---

### Frontend (React + Vite)

**Prerequisites:** Node.js 16+, npm/yarn

```bash
cd frontend

# Install dependencies
npm install

# Run development server
npm run dev
```

**Development server runs on:** `http://localhost:5173`

**Available Scripts:**
```bash
npm run dev       # Start development server with HMR
npm run build     # Build for production
npm run lint      # Run ESLint
npm run preview   # Preview production build
npm run deploy    # Deploy to GitHub Pages
```

**Key Features:**
- ✅ Responsive React UI with Tailwind CSS
- ✅ Client-side routing with React Router
- ✅ Real-time animations with Framer Motion
- ✅ Search functionality with Fuse.js
- ✅ Charts & visualizations with Recharts
- ✅ Firebase authentication
- ✅ Payment integration with Razorpay

**Routes:**
- `/` - Landing page
- `/signin` - Sign in
- `/signup` - Sign up
- `/menu` - Restaurant menu browsing
- `/cart` - Shopping cart
- `/orders` - Order tracking
- `/restaurant-orders` - Restaurant admin dashboard (for restaurant partners)

---

## 🛠️ Tech Stack

### Backend
| Layer | Technology |
|-------|-----------|
| **Framework** | FastAPI 0.136+ |
| **Language** | Python 3.11+ |
| **ORM** | SQLAlchemy |
| **Database** | PostgreSQL |
| **Migrations** | Alembic |
| **Authentication** | Firebase Admin SDK, JWT |
| **Validation** | Pydantic |
| **Async** | AsyncIO |
| **Testing** | Pytest |
| **Code Quality** | Ruff, MyPy |

### Frontend
| Layer | Technology |
|-------|-----------|
| **Framework** | React 19.2+ |
| **Build Tool** | Vite 7.3+ |
| **Styling** | Tailwind CSS 3.4+ |
| **Router** | React Router 7.13+ |
| **Animation** | Framer Motion 12.38+ |
| **UI Components** | Lucide React |
| **Charts** | Recharts 3.8+ |
| **Authentication** | Firebase 12.12+ |
| **Payment** | Razorpay 2.9+ |
| **Search** | Fuse.js 7.1+ |
| **Linting** | ESLint 9.39+ |
| **TypeScript** | Type definitions included |

---

## 📦 Core Dependencies

### Backend (`requirements.txt`)
- **FastAPI** - Modern async web framework
- **Firebase Admin** - Cloud Firestore & authentication
- **SQLAlchemy** - SQL toolkit & ORM
- **Alembic** - Database migration tool
- **Pydantic** - Data validation
- **HTTPX** - Async HTTP client
- **Cryptography** - Security & JWT
- **Uvicorn** - ASGI server

### Frontend (`package.json`)
- **React** - UI library
- **Vite** - Next-gen build tool
- **Tailwind CSS** - Utility-first CSS
- **React Router DOM** - Client-side routing
- **Firebase** - Backend services
- **Razorpay** - Payment gateway
- **Framer Motion** - Animation library
- **Recharts** - Charting library

---

## 🗄️ Database Schema

Key tables include:
- **users** - User accounts and profiles
- **restaurants** - Restaurant information
- **orders** - Order records with status tracking
- **order_items** - Items within each order
- **cart** - Shopping cart management
- **payments** - Payment transaction records
- **menu_items** - Food/grocery items
- **menu_categories** - Item categorization

---

## 🧪 Testing

### Backend
```bash
cd backend
pytest tests/
```

**Test files:**
- `tests/test_app.py` - Application tests
- `tests/test_jwt.py` - JWT authentication tests
- `tests/conftest.py` - Pytest fixtures

### Frontend
Currently set up for ESLint validation:
```bash
cd frontend
npm run lint
```

---

## 🚢 Deployment

### Docker Support
- **Backend:** `backend/Dockerfile` configured for FastAPI
- **Frontend:** `frontend/Dockerfile` configured for production build
- **Render:** `render.yaml` for deployment automation

### Environment
- Deployed on Render platform
- GitHub Pages deployment available for frontend

---

## 📚 API Documentation

Once the backend is running, visit:
- **Swagger UI:** `http://localhost:8000/docs`
- **ReDoc:** `http://localhost:8000/redoc`

---

## 🔐 Authentication & Security

- **JWT-based** authentication for API requests
- **Firebase** integration for user management
- **Rate limiting** middleware to prevent abuse
- **Request validation** for all endpoints
- **CORS** configuration for frontend integration

---

## 📝 Database Migrations

Apply migrations:
```bash
cd backend
alembic upgrade head
```

Create new migration:
```bash
alembic revision --autogenerate -m "migration message"
```

---

## 🐛 Troubleshooting

### Backend
- Ensure PostgreSQL is running
- Check `DATABASE_URL` environment variable
- Verify Firebase credentials in `.env`

### Frontend
- Clear node_modules & reinstall: `rm -rf node_modules && npm install`
- Clear Vite cache: `rm -rf .vite`
- Check that backend API is accessible

---

## 📄 License

This project is part of the HaveIt initiative.

---

## 🤝 Contributing

Contributions welcome! Please ensure:
- Code passes linting (`npm run lint`, `ruff check`)
- Tests pass (`pytest`)
- Commits follow conventional commits format

---

## 📞 Contact & Support

For issues or questions, please refer to the project documentation or create an issue in the repository.

---

**Last Updated:** 2026-09-01


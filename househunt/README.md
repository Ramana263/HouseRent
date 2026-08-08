# HouseHunt — House Rent Management System

A full-stack MERN application (MongoDB, Express.js, React.js, Node.js) for browsing,
listing, and booking rental properties, with role-based authentication and admin
moderation.

## Features

- **Auth**: JWT-based registration/login, password hashing with bcryptjs, role-based
  access control (`user` / `admin`).
- **Properties**: Create, browse, filter (city, price range, type, bedrooms, keyword
  search), edit, and delete listings. New listings require admin approval before they
  appear publicly.
- **Bookings**: Tenants request to book a property; owners confirm or reject requests;
  tenants can cancel pending requests.
- **Admin dashboard**: Platform stats, property approval queue, and user management
  (activate/deactivate accounts).
- **Responsive UI**: React + React-Bootstrap, with a search/filter panel, dashboards,
  and forms.

## Project Structure

```
househunt/
├── backend/
│   ├── config/db.js
│   ├── models/          User.js, Property.js, Booking.js
│   ├── middleware/       auth.js, errorHandler.js
│   ├── controllers/      authController.js, propertyController.js,
│   │                     bookingController.js, adminController.js
│   ├── routes/           authRoutes.js, propertyRoutes.js,
│   │                     bookingRoutes.js, adminRoutes.js
│   ├── server.js
│   └── .env.example
└── frontend/
    ├── public/index.html
    └── src/
        ├── components/   Navbar.js, PropertyCard.js, ProtectedRoute.js
        ├── context/       AuthContext.js
        ├── pages/         Home.js, Login.js, Register.js, PropertyDetail.js,
        │                  AddProperty.js, Dashboard.js, AdminPanel.js
        ├── services/      api.js (Axios instance)
        └── App.js
```

## 1. Prerequisites

- Node.js (v18+ recommended)
- MongoDB running locally, or a MongoDB Atlas connection string
- Git

## 2. Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# Edit .env: set MONGO_URI and a strong JWT_SECRET
npm run dev        # starts with nodemon on http://localhost:5000
```

Health check: `GET http://localhost:5000/api/health`

## 3. Frontend Setup

```bash
cd frontend
npm install
cp .env.example .env
# Edit .env if your API runs on a different host/port
npm start           # starts on http://localhost:3000
```

## 4. Creating an Admin User

Register normally through the UI, then either:
- Register with `"role": "admin"` in the request body (the API allows self-assigning
  admin for demo/dev purposes — **remove this in production** and instead promote
  users manually), or
- Manually update the user's `role` field to `"admin"` in MongoDB:
  ```js
  db.users.updateOne({ email: "you@example.com" }, { $set: { role: "admin" } })
  ```

## 5. API Overview

| Method | Endpoint                          | Access        | Description                     |
|--------|------------------------------------|---------------|----------------------------------|
| POST   | /api/auth/register                | Public        | Register a new user             |
| POST   | /api/auth/login                   | Public        | Log in, returns JWT             |
| GET    | /api/auth/me                      | Private       | Get current user profile        |
| PUT    | /api/auth/me                      | Private       | Update profile                  |
| GET    | /api/properties                   | Public        | List/search approved properties |
| GET    | /api/properties/:id                | Public        | Property detail                 |
| POST   | /api/properties                   | Private       | Create listing (goes to pending)|
| PUT    | /api/properties/:id                | Owner/Admin   | Edit listing                    |
| DELETE | /api/properties/:id                | Owner/Admin   | Delete listing                  |
| GET    | /api/properties/mine/list          | Private       | Your own listings               |
| POST   | /api/bookings                      | Private       | Request a booking               |
| GET    | /api/bookings/mine                 | Private       | Your booking requests           |
| GET    | /api/bookings/received             | Private       | Requests on your properties     |
| PUT    | /api/bookings/:id/status            | Owner/Tenant  | Confirm/reject/cancel a booking |
| GET    | /api/admin/stats                   | Admin         | Platform statistics             |
| GET    | /api/admin/properties/pending      | Admin         | Properties awaiting approval    |
| PUT    | /api/admin/properties/:id/review    | Admin         | Approve/reject a listing        |
| GET    | /api/admin/users                   | Admin         | List all users                  |
| PUT    | /api/admin/users/:id/toggle-active  | Admin         | Activate/deactivate a user      |

## 6. Notes on Security

- Passwords are hashed with bcryptjs before storage.
- JWTs are signed with `JWT_SECRET` and expire per `JWT_EXPIRES_IN`.
- Role-based middleware (`protect`, `authorize`) guards private and admin-only routes.
- Centralized error handling middleware normalizes Mongoose/validation errors into
  clean JSON responses.

## 7. Suggested Next Steps

- Add image upload (e.g. Multer + S3/Cloudinary) instead of raw image URLs.
- Add refresh tokens / token blacklisting for logout-everywhere support.
- Add automated tests (Jest + Supertest for the API, React Testing Library for the UI).
- Add rate limiting (e.g. `express-rate-limit`) on auth routes.

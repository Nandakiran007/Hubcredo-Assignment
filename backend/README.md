# Backend

Node.js + Express backend for auth.

Quick start:

1. Copy `.env.example` to `.env` and set values.
2. npm install
3. npm run dev (requires nodemon) or npm start

API endpoints:

-   POST `/api/auth/signup` { username, email, password } -> { token, user }
-   POST `/api/auth/login` { email, password } -> { token, user }

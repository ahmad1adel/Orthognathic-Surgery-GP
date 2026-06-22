# Orthognathic Surgery — Backend API

Node.js + Express + MongoDB (Mongoose) backend with JWT-based sign up / sign in.

## Stack
- **Express** — HTTP server & routing
- **Mongoose** — MongoDB ODM
- **bcryptjs** — password hashing
- **jsonwebtoken** — JWT auth tokens
- **cors / dotenv** — CORS + environment config

## Setup

```bash
cd Backend
npm install
```

Configure environment variables in `.env` (already created from `.env.example`):

```
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/orthognathicDB
JWT_SECRET=change_this_to_a_long_random_secret_string
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
```

> ⚠️ Change `JWT_SECRET` to a long random value before deploying.

Make sure your local MongoDB is running (the one you connect to in MongoDB Compass).
The `orthognathicDB` database and its `users` collection are created automatically
on the first signup — refresh Compass to see them.

## Run

```bash
npm run dev    # auto-restart on file changes (node --watch)
npm start      # plain start
```

Server: http://localhost:5000

## API

| Method | Endpoint           | Auth   | Body                                 | Description            |
|--------|--------------------|--------|--------------------------------------|------------------------|
| GET    | `/`                | —      | —                                    | Health check           |
| POST   | `/api/auth/signup` | —      | `{ name, email, password, role }`    | Register a new user    |
| POST   | `/api/auth/login`  | —      | `{ email, password }`                | Log in                 |
| GET    | `/api/auth/me`     | Bearer | —                                    | Current logged-in user |

`role` is `"patient"` (default) or `"doctor"`.

Successful auth responses return:

```json
{
  "user": { "id": "...", "name": "...", "email": "...", "role": "patient" },
  "token": "<JWT>"
}
```

Send the token on protected routes as `Authorization: Bearer <token>`.

## Project structure

```
Backend/
├── config/db.js              # MongoDB connection
├── controllers/authController.js
├── middleware/auth.js        # JWT "protect" middleware
├── models/User.js            # User schema (hashed password)
├── routes/authRoutes.js
├── server.js                 # App entry point
└── .env
```

## Quick test (curl)

```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@test.com","password":"secret123","role":"patient"}'
```

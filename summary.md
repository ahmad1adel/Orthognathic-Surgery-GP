# Orthognathic Surgery AI Platform — Project Summary

## Overview

A full-stack AI-powered web platform for orthognathic (jaw) surgery diagnosis and patient support. The system combines deep learning models, a RAG-based medical chatbot, nearby clinic discovery, and a subscription management system into a unified application for both patients and dental professionals.

---

## Architecture

```
Orthognathic Surgery/
├── Frontend/          React + TypeScript + Vite + Tailwind CSS
├── Backend/           Node.js + Express + MongoDB (main API)
└── Backend/AI-Backend/
    ├── Jaw-CNN/       Flask — CNN jaw classifier     (port 5002)
    ├── RAG/           Flask — RAG doctor chatbot     (port 5003)
    ├── Patient-Chatbot/ Flask — Groq patient chatbot (port 5004)
    └── Google Maps/   Flask — Places API proxy       (port 5001)
```

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, TypeScript, Vite, Tailwind CSS, shadcn/ui |
| Routing | React Router v6 |
| State | React Context (Auth, AuthGate, Language, Usage) |
| Backend API | Node.js, Express, MongoDB, Mongoose, JWT, bcryptjs |
| CNN Service | Python, Flask, Keras/TensorFlow (`jaw_cnn_model.h5`) |
| RAG Service | Python, Flask, LangChain, pgvector (PostgreSQL), BM25, CrossEncoder, Groq LLM |
| Patient Chatbot | Python, Flask, Groq API (`llama-3.3-70b-versatile`) |
| Maps | Google Maps JavaScript API, Places API (New), Directions API |
| Database | MongoDB Atlas (users, subscriptions), PostgreSQL + pgvector (RAG vectors) |

---

## Backend API (Node.js — port 5000)

### Auth Routes `/api/auth`

| Method | Endpoint | Description |
|---|---|---|
| POST | `/signup` | Register new user (patient or doctor) |
| POST | `/login` | Login, returns JWT token |
| GET | `/me` | Get current user (requires token) |
| PUT | `/profile` | Update name and/or profile image (base64) |

### Subscription Routes `/api/subscription`

| Method | Endpoint | Description |
|---|---|---|
| GET | `/` | Get current plan, usage counters, and `canUse*` flags |
| POST | `/subscribe` | Upgrade to a paid plan, resets all counters |
| POST | `/record` | Increment CNN / GAN / chat usage counter |
| POST | `/cancel` | Cancel subscription, return to free tier |

### Places Route `/api/places`

| Method | Endpoint | Description |
|---|---|---|
| POST | `/nearby` | Find nearby dental clinics via Google Places API (New) |

---

## AI Microservices (Python/Flask)

### CNN Jaw Classifier (port 5002)
- `POST /predict` — accepts multipart image, returns `{ prediction, confidence, scores }`
- Model: Keras CNN trained on jaw X-rays, classifies **Concave / Convex / Normal**
- Input: resized to 224×224 grayscale, normalized to float32

### RAG Doctor Chatbot (port 5003)
- `POST /chat` — body: `{ message }`, returns `{ answer, sources }`
- Pipeline: HuggingFace embeddings (all-MiniLM-L6-v2) + pgvector cosine search + BM25 hybrid + CrossEncoder reranker (BAAI/bge-reranker-base)
- LLM: Groq `meta-llama/llama-4-scout-17b-16e-instruct`
- Knowledge base: dental/orthognathic PDFs ingested into PostgreSQL + pgvector (Docker container `pgvector_db` on port 5433)

### Patient Chatbot (port 5004)
- `POST /chat` — body: `{ message, history }`, returns `{ answer }`
- LLM: Groq `llama-3.3-70b-versatile`
- Restricted by system prompt to **orthognathic surgery topics only**

---

## Frontend Pages

| Route | Page | Description |
|---|---|---|
| `/` | Home | Hero, features, How It Works, 6 jaw conditions, FAQs, stats |
| `/cnn-upload` | CNNUpload | X-ray upload + CNN prediction with usage limit enforcement |
| `/gan-upload` | GANUpload | GAN jaw restoration upload (usage-gated) |
| `/chatbot` | Chatbot | Role-based chat: patient → Groq bot, doctor → RAG bot |
| `/gallery` | Gallery | Before/after drag-slider for Micrognathia & Macrognathia cases |
| `/nearby-dentists` | NearbyDentists | Google Maps with nearby clinic markers + directions |
| `/pricing` | Pricing | Role-based subscription plans (3 patient / 3 doctor) |
| `/patient-profile` | PatientProfile | Profile image, name, upload history, quick actions |
| `/doctor-dashboard` | DoctorDashboard | Profile, patient stats, recent cases |
| `/login` | Login | JWT login form |
| `/signup` | Signup | Registration with role selection |
| `/about` | About | Platform info |
| `/contact` | Contact | Contact form |

---

## Subscription & Usage System

### Free Tier Limits

| Feature | Patient | Doctor |
|---|---|---|
| CNN Analyses | 5 (lifetime) | 3 (lifetime) |
| GAN Restorations | **0 (paid only)** | 1 (lifetime) |
| AI Chat | 7 messages/day | 5 messages/day |

### Paid Plans

**Patient Plans**

| Plan | Price | CNN | GAN | Chat |
|---|---|---|---|---|
| Basic | $9/mo | 30/mo | 5/mo | 50/day |
| Standard | $19/mo | 100/mo | 15/mo | 100/day |
| Premium | $39/mo | Unlimited | Unlimited | Unlimited |

**Doctor Plans**

| Plan | Price | CNN | GAN | Chat |
|---|---|---|---|---|
| Starter | $29/mo | 50/mo | 10/mo | 50/day |
| Professional | $59/mo | 200/mo | 50/mo | 200/day |
| Enterprise | $99/mo | Unlimited | Unlimited | Unlimited |

Usage is stored in MongoDB per user. Monthly counters reset automatically each calendar month; daily chat counter resets each day. The frontend UsageContext syncs with the backend on login and after every action with optimistic UI updates.

---

## Authentication & Authorization

- JWT stored in `localStorage`, restored on app load via `GET /api/auth/me`
- `AuthContext` exposes `user`, `login`, `logout`, `updateProfile`
- `AuthGate` pattern: users can browse freely but any action triggers a sign-up/login popup
- Role-based routing: patients see Groq chatbot, doctors see RAG chatbot; dashboard/profile links differ by role

---

## Data Models

### User (MongoDB)
```
name, email, password (bcrypt), role (patient|doctor),
profileImage (base64),
plan, planStartedAt, planExpiresAt,
cnnFreeUsed, ganFreeUsed,
cnnMonthUsed, ganMonthUsed, usageMonth,
chatDayUsed, chatDate
```

---

## Running the Project

### 1. Main Backend
```bash
cd Backend
npm install
# create .env with MONGO_URI, JWT_SECRET, CLIENT_URL, GOOGLE_MAPS_API_KEY
node server.js          # runs on port 5000
```

### 2. CNN Service
```bash
cd Backend/AI-Backend/Jaw-CNN
pip install flask keras tensorflow pillow
python app.py           # runs on port 5002
```

### 3. RAG Service
```bash
# Start pgvector container (pre-ingested)
docker start pgvector_db

cd Backend/AI-Backend/RAG
pip install flask langchain groq psycopg2 sentence-transformers rank-bm25
# create .env with GROQ_API_KEY, POSTGRES_*
python app.py           # runs on port 5003
```

### 4. Patient Chatbot
```bash
cd Backend/AI-Backend/Patient-Chatbot
pip install flask groq
# create .env with GROQ_API_KEY
python app.py           # runs on port 5004
```

### 5. Frontend
```bash
cd Frontend
npm install
# create .env with VITE_API_URL, VITE_CNN_API_URL, VITE_RAG_API_URL,
#   VITE_PATIENT_CHAT_URL, VITE_GOOGLE_MAPS_API_KEY
npm run dev             # runs on port 8080
```

---

## GitHub Repository

**`ahmad1adel/Orthognathic-Surgery-GP`** — branch: `main`

> **Security note:** `.env` files, `*.h5` model weights, `**/data/*.pdf`, and `**/vectorstore/` are excluded from the repository via `.gitignore`.

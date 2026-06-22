# AI-Backend (Flask)

Python/Flask API for the AI/maps features of the Orthognathic Surgery platform.
Exposes a Google Places proxy (`/nearby-dentists`) and is the place to grow future
Python-based AI endpoints (CNN/GAN models, etc.).

> **Note:** The map UI lives in the React frontend (`Frontend/src/pages/NearbyDentists.tsx`,
> route `/nearby-dentists`). The same nearby-dentists logic is also available in the main
> Node backend at `GET /api/places/nearby-dentists`, which is what the React website
> currently uses. This Flask service is JSON-only (no HTML page).

## Setup

```bash
cd Backend/AI-Backend
python -m venv venv
# Windows:
venv\Scripts\activate
# macOS/Linux:
# source venv/bin/activate

pip install -r requirements.txt
```

## Run

```bash
python app.py
```

Runs on **http://127.0.0.1:5001** (port 5001 so it does not clash with the Node
backend on 5000).

- `GET /nearby-dentists?lat=&lng=&min_rating=&max_distance=` — JSON list of nearby dentists

## ⚠️ Google Maps API key

`app.py` uses a Google Maps API key (`GOOGLE_MAPS_API_KEY`). The original key is
**invalid** — replace it with a working key that has the **Places API** enabled
(with billing) in Google Cloud Console.

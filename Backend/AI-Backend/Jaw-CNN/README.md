# Jaw-CNN (Flask)

CNN classifier that labels a jaw X-ray as **concave** or **convex**.
Model: `jaw_cnn_model.h5` (Keras, grayscale 224×224 input).

The map/UI lives in the React frontend (`Frontend/src/pages/CNNUpload.tsx`, route
`/cnn-upload`). This service is JSON-only.

## Setup

```bash
cd Backend/AI-Backend/Jaw-CNN
python -m venv venv
venv\Scripts\activate          # Windows  (macOS/Linux: source venv/bin/activate)
pip install -r requirements.txt
```

## Run

```bash
python app.py
```

Runs on **http://127.0.0.1:5002** (port 5002 so it doesn't clash with the Node backend
on 5000 or the Google Maps Flask on 5001).

### Endpoints
- `GET /health` → `{ "status": "ok", "model": "jaw-cnn" }`
- `POST /predict` — multipart form, field **`image`** (an X-ray image file)

Response:
```json
{
  "prediction": "concave",
  "confidence": 0.5395,
  "scores": { "concave": 0.5395, "convex": 0.4605 }
}
```

### Quick test
```bash
curl -X POST http://127.0.0.1:5002/predict -F "image=@sample_xray.jpg"
```

> **Note:** `jaw_cnn_model.h5` (~128 MB) is git-ignored. Keep a copy of the model file
> in this folder for the service to start.

import os
import uuid

from flask import Flask, request, jsonify
from flask_cors import CORS
from tensorflow.keras.models import load_model
import numpy as np
import cv2

app = Flask(__name__)
CORS(app)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
UPLOAD_FOLDER = os.path.join(BASE_DIR, "uploads")
MODEL_PATH = os.path.join(BASE_DIR, "jaw_cnn_model.h5")
LABELS = ["concave", "convex"]

os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# Load the trained CNN once at startup
model = load_model(MODEL_PATH)


def prepare_image(path):
    img = cv2.imread(path, cv2.IMREAD_GRAYSCALE)
    if img is None:
        return None
    img = cv2.resize(img, (224, 224))
    img = img.astype("float32") / 255.0
    img = np.expand_dims(img, axis=-1)   # (224, 224, 1)
    img = np.expand_dims(img, axis=0)    # (1, 224, 224, 1)
    return img


@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "ok", "model": "jaw-cnn"})


@app.route("/predict", methods=["POST"])
def predict():
    if "image" not in request.files:
        return jsonify({"error": "No image file provided (field name must be 'image')"}), 400

    file = request.files["image"]
    if file.filename == "":
        return jsonify({"error": "Empty filename"}), 400

    # Save with a unique name to avoid collisions
    ext = os.path.splitext(file.filename)[1] or ".jpg"
    filename = f"{uuid.uuid4().hex}{ext}"
    filepath = os.path.join(UPLOAD_FOLDER, filename)
    file.save(filepath)

    try:
        img = prepare_image(filepath)
        if img is None:
            return jsonify({"error": "Could not read the image. Please upload a valid image file."}), 400

        prediction = model.predict(img)[0]
        class_idx = int(np.argmax(prediction))
        confidence = float(prediction[class_idx])

        return jsonify({
            "prediction": LABELS[class_idx],
            "confidence": round(confidence, 4),
            "scores": {LABELS[i]: round(float(prediction[i]), 4) for i in range(len(LABELS))},
        })
    except Exception as e:
        print("Prediction error:", e)
        return jsonify({"error": "Failed to run prediction"}), 500
    finally:
        # Clean up the uploaded file
        if os.path.exists(filepath):
            os.remove(filepath)


if __name__ == "__main__":
    # Port 5002 to avoid clashing with the Node backend (5000) and the Google Maps Flask (5001)
    app.run(debug=True, port=5002)

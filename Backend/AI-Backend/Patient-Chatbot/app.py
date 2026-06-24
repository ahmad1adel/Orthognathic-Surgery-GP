import os
import requests
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app)

GROQ_API_KEY = os.getenv("GROQ_API_KEY")
GROQ_MODEL = os.getenv("GROQ_MODEL", "llama-3.3-70b-versatile")
GROQ_URL = "https://api.groq.com/openai/v1/chat/completions"

# Domain-restricted persona: orthognathic surgery ONLY
SYSTEM_PROMPT = """You are "DentalAI Assistant", a friendly assistant for PATIENTS,
specialized EXCLUSIVELY in orthognathic (corrective jaw) surgery and directly related topics:
jaw and facial deformities (overbite, underbite, open bite, facial asymmetry, micrognathia,
macrogenia, chin deformities), their diagnosis, treatment options, the surgical procedure,
related orthodontics, risks, preparation, and recovery.

STRICT RULES:
- ONLY answer questions about orthognathic surgery and the topics listed above.
- If a question is NOT related to orthognathic surgery (e.g. general medicine, other surgeries,
  programming, math, weather, news, anything off-topic), politely DECLINE. Reply with something
  like: "I'm sorry, I can only help with questions about orthognathic (corrective jaw) surgery."
  Do not attempt to answer the off-topic part.
- Use clear, reassuring, patient-friendly language. Explain medical terms simply.
- You are NOT a replacement for professional care. For personal medical decisions, advise the
  patient to consult their surgeon or doctor.
- Keep answers concise and easy to read.
"""


@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "ok", "model": GROQ_MODEL, "key_set": bool(GROQ_API_KEY)})


@app.route("/chat", methods=["POST"])
def chat():
    if not GROQ_API_KEY:
        return jsonify({"error": "GROQ_API_KEY is not configured on the server"}), 500

    data = request.get_json(silent=True) or {}
    message = (data.get("message") or "").strip()
    if not message:
        return jsonify({"error": "message is required"}), 400

    # Optional prior turns: [{ "role": "user"|"assistant", "content": "..." }]
    history = data.get("history") or []
    messages = [{"role": "system", "content": SYSTEM_PROMPT}]
    for turn in history[-10:]:  # cap context
        role = turn.get("role")
        content = turn.get("content")
        if role in ("user", "assistant") and content:
            messages.append({"role": role, "content": content})
    messages.append({"role": "user", "content": message})

    try:
        resp = requests.post(
            GROQ_URL,
            headers={
                "Authorization": f"Bearer {GROQ_API_KEY}",
                "Content-Type": "application/json",
            },
            json={
                "model": GROQ_MODEL,
                "messages": messages,
                "temperature": 0.4,
                "max_tokens": 1024,
            },
            timeout=60,
        )
        body = resp.json()
        if resp.status_code != 200:
            err = body.get("error", {}).get("message", f"Groq error ({resp.status_code})")
            return jsonify({"error": err}), 502

        answer = body["choices"][0]["message"]["content"].strip()
        return jsonify({"answer": answer})
    except Exception as e:
        print("Patient chat error:", e)
        return jsonify({"error": "Failed to get a response"}), 500


if __name__ == "__main__":
    # Port 5004 — Node:5000, GMaps:5001, CNN:5002, RAG:5003, Patient-Chatbot:5004
    app.run(debug=True, port=5004)

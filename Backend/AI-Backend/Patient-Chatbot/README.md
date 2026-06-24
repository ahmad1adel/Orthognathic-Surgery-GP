# Patient-Chatbot (Flask)

Lightweight **Groq** chatbot for **patients**, restricted to **orthognathic surgery** topics
only. No RAG / no vector store — just a domain-locked system prompt.

- **Patients** use this chatbot.
- **Doctors** use the RAG service (`../RAG`) which answers from medical books with sources.

## Setup

```bash
cd Backend/AI-Backend/Patient-Chatbot
pip install -r requirements.txt
```

Set your key in `.env`:
```
GROQ_API_KEY=your_groq_api_key
GROQ_MODEL=llama-3.3-70b-versatile
```

## Run

```bash
python app.py
```

Runs on **http://127.0.0.1:5004** (Node:5000, GMaps:5001, CNN:5002, RAG:5003, this:5004).

## Endpoints
- `GET /health`
- `POST /chat` — body `{ "message": "...", "history": [{role, content}, ...] }` → `{ "answer": "..." }`

```bash
curl -X POST http://127.0.0.1:5004/chat -H "Content-Type: application/json" \
  -d '{"message":"What is orthognathic surgery?"}'
```

Off-topic questions are politely declined (it only answers orthognathic-surgery questions).

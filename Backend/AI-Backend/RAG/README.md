# RAG (Flask) — Dental/Orthognathic Chatbot

Retrieval-Augmented Generation API powering the React chatbot.

**Pipeline:** Groq LLM (`llama-4-scout`) + PostgreSQL/pgvector + hybrid search
(vector + BM25) + cross-encoder reranking (BAAI/bge-reranker-base).
Embeddings: local `sentence-transformers/all-MiniLM-L6-v2`.

## Files
- `app.py` — Flask API (`/chat`, `/health`), port **5003**
- `rag_chain.py` — the RAG chain (retriever + reranker + Groq)
- `ingest.py` — load PDFs from `data/` into pgvector
- `data/` — source PDFs (the knowledge base)
- `docker-compose.yml` — Postgres (pgvector) on `:5433` + pgAdmin on `:5050`
- `.env` — `POSTGRES_URL`, `POSTGRES_PASSWORD`, `GROQ_API_KEY`

## Setup

```bash
cd Backend/AI-Backend/RAG
pip install -r requirements.txt
```

### 1. Start PostgreSQL (pgvector)
```bash
docker compose up -d
```
This runs Postgres on **localhost:5433** (the volume persists your ingested vectors).

### 2. Ingest the PDFs (only the first time, or when you add documents)
Drop new PDFs into `data/`, then:
```bash
python ingest.py
```

### 3. Run the API
```bash
python app.py
```
Runs on **http://127.0.0.1:5003**. The pipeline loads at startup (embeddings + reranker
+ DB), so first boot takes ~30–60s.

## Endpoints
- `GET /health` → `{ status, ready, error }`
- `POST /chat` — body `{ "message": "..." }` → `{ "answer": "...", "sources": [{source, page, score}] }`

```bash
curl -X POST http://127.0.0.1:5003/chat \
  -H "Content-Type: application/json" \
  -d '{"message":"What is orthognathic surgery?"}'
```

## Adding your own documents
Put PDFs in `data/` and re-run `python ingest.py`. They'll be chunked, embedded, and
stored in pgvector, and the chatbot will use them immediately on the next API restart.

## Ports in this project
- 5000 — Node backend (auth, places)
- 5001 — Google Maps Flask
- 5002 — Jaw-CNN Flask
- **5003 — RAG Flask (this service)**

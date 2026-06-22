import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv

from rag_chain import qa_bot

load_dotenv()

app = Flask(__name__)
CORS(app)

# Built once; the pipeline load (embeddings, BM25, reranker, DB) is slow
_chain = None
_init_error = None


def get_chain():
    global _chain, _init_error
    if _chain is None and _init_error is None:
        try:
            _chain = qa_bot()
        except Exception as e:
            _init_error = str(e)
            print("RAG init error:", e)
    return _chain


@app.route("/health", methods=["GET"])
def health():
    return jsonify({
        "status": "ok",
        "ready": _chain is not None,
        "error": _init_error,
    })


@app.route("/chat", methods=["POST"])
def chat():
    data = request.get_json(silent=True) or {}
    message = (data.get("message") or "").strip()
    if not message:
        return jsonify({"error": "message is required"}), 400

    chain = get_chain()
    if chain is None:
        return jsonify({
            "error": f"RAG not initialized: {_init_error}. "
                     "Is PostgreSQL running on :5433 and has ingest.py been run?"
        }), 503

    try:
        res = chain.invoke({"query": message})
        answer = res["result"]

        # Deduplicate sources by (book, page)
        sources = []
        seen = set()
        for doc in res.get("source_documents", []):
            meta = doc.metadata or {}
            book = meta.get("category_name") or os.path.basename(str(meta.get("source", "Unknown")))
            page = meta.get("page_number")
            key = (book, page)
            if key not in seen:
                seen.add(key)
                sources.append({
                    "source": book,
                    "page": page,
                    "score": round(meta.get("rerank_score", 0), 3),
                })

        return jsonify({"answer": answer, "sources": sources})
    except Exception as e:
        print("Chat error:", e)
        return jsonify({"error": "Failed to process query"}), 500


if __name__ == "__main__":
    # Build the pipeline at startup so the first user request is fast.
    # use_reloader=False prevents loading the heavy models twice in debug mode.
    get_chain()
    app.run(debug=True, port=5003, use_reloader=False)

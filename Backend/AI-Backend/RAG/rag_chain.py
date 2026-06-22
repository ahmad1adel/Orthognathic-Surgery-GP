import os
from typing import Any, List
from dotenv import load_dotenv
from pydantic import Field

from langchain_core.prompts import PromptTemplate
from langchain_core.documents import Document
from langchain_core.retrievers import BaseRetriever
from langchain_core.runnables import RunnablePassthrough, RunnableLambda
from langchain_core.output_parsers import StrOutputParser
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_postgres import PGVector
from langchain_community.retrievers import BM25Retriever
from sentence_transformers import CrossEncoder
from langchain_groq import ChatGroq

load_dotenv()

# ── PostgreSQL / pgvector connection ─────────────────────────────────────────
COLLECTION_NAME = "RAG_embeddings_gp"


def get_connection_string() -> str:
    postgres_url = os.getenv("POSTGRES_URL")
    postgres_password = os.getenv("POSTGRES_PASSWORD")
    if not postgres_url:
        raise ValueError("POSTGRES_URL is not set in the environment variables.")
    if postgres_password and "@" in postgres_url:
        scheme_and_auth, rest = postgres_url.split("@", 1)
        if "://" in scheme_and_auth:
            scheme, auth = scheme_and_auth.split("://", 1)
            if ":" not in auth:
                postgres_url = f"{scheme}://{auth}:{postgres_password}@{rest}"
    return postgres_url


class HybridRetriever(BaseRetriever):
    vectorstore: Any = Field(exclude=True)
    bm25_retriever: Any = Field(exclude=True)
    reranker: Any = Field(exclude=True)
    top_k: int = 10
    final_top_k: int = 3
    rerank_threshold: float = 0.1

    def _get_relevant_documents(self, query: str) -> List[Document]:
        # 1. Vector search (cosine)
        vector_results = self.vectorstore.similarity_search_with_score(query, k=self.top_k)
        # 2. Keyword search (BM25)
        bm25_results = self.bm25_retriever.invoke(query)[: self.top_k]

        # 3. Combine + dedupe
        all_docs = []
        seen_content = set()
        for doc, score in vector_results:
            if doc.page_content not in seen_content:
                doc.metadata["vector_score"] = float(score)
                doc.metadata["retrieval_method"] = "vector"
                all_docs.append(doc)
                seen_content.add(doc.page_content)
        for doc in bm25_results:
            if doc.page_content not in seen_content:
                doc.metadata["vector_score"] = 0.0
                doc.metadata["retrieval_method"] = "bm25"
                all_docs.append(doc)
                seen_content.add(doc.page_content)

        if not all_docs:
            return []

        # 4. Cross-encoder rerank
        pairs = [[query, doc.page_content] for doc in all_docs]
        rerank_scores = self.reranker.predict(pairs)
        for doc, score in zip(all_docs, rerank_scores):
            doc.metadata["rerank_score"] = float(score)

        # 5. Threshold + sort + top-k
        passed_docs = [d for d in all_docs if d.metadata["rerank_score"] >= self.rerank_threshold]
        passed_docs.sort(key=lambda x: x.metadata["rerank_score"], reverse=True)
        return passed_docs[: self.final_top_k]

    async def _aget_relevant_documents(self, query: str) -> List[Document]:
        return self._get_relevant_documents(query)


def set_custom_prompt():
    custom_prompt_template = """Use the following pieces of information to answer the user's question.
    The information includes text from medical books retrieved via Hybrid Search (Vector + Keyword) and Reranked for relevance.
    If you don't know the answer, just say that you don't know, don't try to make up an answer.

    Context: {context}
    Question: {question}

    Only return the helpful answer below and nothing else.
    Helpful answer:
    """
    return PromptTemplate(template=custom_prompt_template, input_variables=["context", "question"])


def retrieval_qa_chain(llm, prompt, retriever):
    """LCEL chain that returns {result, source_documents}. Retrieves once per query."""

    def format_docs(docs: List[Document]) -> str:
        return "\n\n".join(doc.page_content for doc in docs)

    chain = (
        RunnablePassthrough.assign(
            source_documents=RunnableLambda(lambda x: retriever.invoke(x["query"])),
        )
        | RunnablePassthrough.assign(
            context=lambda x: format_docs(x["source_documents"]),
            question=lambda x: x["query"],
        )
        | RunnablePassthrough.assign(
            result=(prompt | llm | StrOutputParser())
        )
    )
    return chain


def load_llm():
    api_key = os.environ.get("GROQ_API_KEY")
    if not api_key:
        print("WARNING: GROQ_API_KEY environment variable is not set!")
    return ChatGroq(
        model="meta-llama/llama-4-scout-17b-16e-instruct",
        temperature=0.4,
        max_tokens=1024,
        groq_api_key=api_key,
    )


def qa_bot():
    print("\n--- Initializing RAG pipeline (Groq + pgvector + hybrid + rerank) ---")

    embeddings = HuggingFaceEmbeddings(
        model_name="sentence-transformers/all-MiniLM-L6-v2",
        model_kwargs={"device": "cpu"},
    )

    print("Connecting to PGVector (PostgreSQL)...")
    db = PGVector(
        embeddings=embeddings,
        collection_name=COLLECTION_NAME,
        connection=get_connection_string(),
        use_jsonb=True,
    )

    print("Initializing BM25 retriever from stored chunks...")
    pg_retriever = db.as_retriever(search_kwargs={"k": 500})
    all_docs = pg_retriever.invoke("dental oral surgery")
    if not all_docs:
        raise RuntimeError("No documents found in PostgreSQL. Run ingest.py first.")
    bm25_retriever = BM25Retriever.from_documents(all_docs)

    print("Loading reranker (BAAI/bge-reranker-base)...")
    reranker = CrossEncoder("BAAI/bge-reranker-base")

    retriever = HybridRetriever(
        vectorstore=db, bm25_retriever=bm25_retriever, reranker=reranker
    )

    chain = retrieval_qa_chain(load_llm(), set_custom_prompt(), retriever)
    print("--- RAG pipeline ready ---")
    return chain

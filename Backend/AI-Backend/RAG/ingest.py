import os
import uuid
from datetime import datetime
from dotenv import load_dotenv

from langchain_huggingface import HuggingFaceEmbeddings
from langchain_postgres import PGVector
from langchain_community.document_loaders import PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter

# Load environment variables
load_dotenv()

DATA_PATH = 'data/'
COLLECTION_NAME = "RAG_embeddings_gp"

def get_connection_string():
    postgres_url = os.getenv("POSTGRES_URL")
    postgres_password = os.getenv("POSTGRES_PASSWORD")
    if not postgres_url:
        raise ValueError("POSTGRES_URL is not set in the environment variables.")
    
    # Format: postgresql+psycopg://user[:password]@host:port/dbname
    if postgres_password and "@" in postgres_url:
        scheme_and_auth, rest = postgres_url.split("@", 1)
        if "://" in scheme_and_auth:
            scheme, auth = scheme_and_auth.split("://", 1)
            # If there's no colon in auth (meaning no password present), inject it
            if ":" not in auth:
                postgres_url = f"{scheme}://{auth}:{postgres_password}@{rest}"
    return postgres_url

def create_vector_db():
    print(f"--- Starting PostgreSQL/pgvector Ingestion from {DATA_PATH} ---")
    print("--- Using Cosine Similarity Strategy ---")

    # Use local HuggingFace embeddings matching model.py
    embeddings = HuggingFaceEmbeddings(
        model_name="sentence-transformers/all-MiniLM-L6-v2",
        model_kwargs={'device': 'cpu'}
    )

    connection_string = get_connection_string()

    # Initialize PGVector store
    vector_store = PGVector(
        embeddings=embeddings,
        collection_name=COLLECTION_NAME,
        connection=connection_string,
        use_jsonb=True
    )

    pdf_files = [f for f in os.listdir(DATA_PATH) if f.endswith('.pdf')]
    
    if not pdf_files:
        print(f"No PDF files found in {DATA_PATH}")
        return

    for pdf_file in pdf_files:
        file_path = os.path.join(DATA_PATH, pdf_file)
        book_name = pdf_file.replace(".pdf", "")
        print(f"\nProcessing: {book_name}")

        print(f"  - Extracting text and chunking...")
        try:
            loader = PyPDFLoader(file_path)
            documents = loader.load()
            text_splitter = RecursiveCharacterTextSplitter(chunk_size=600, chunk_overlap=100)
            texts = text_splitter.split_documents(documents)
            total_chunks = len(texts)
            
            prepared_docs = []
            for i, chunk in enumerate(texts):
                page_num = chunk.metadata.get('page', 0) + 1
                doc_id = str(uuid.uuid4())
                
                # Attach chunk metadata
                chunk.metadata = {
                    "id": doc_id,
                    "title": f"{book_name}_chunk_{i}",
                    "category_name": book_name,
                    "page_number": page_num,
                    "created_at": datetime.utcnow().isoformat(),
                    "enabled": True,
                    "type": "text"
                }
                prepared_docs.append(chunk)

            print(f"  - Uploading {total_chunks} chunks to PostgreSQL/pgvector...")
            vector_store.add_documents(prepared_docs)
            print(f"  - Successfully processed and stored {total_chunks} chunks for {book_name}.")
            
            if prepared_docs:
                preview = prepared_docs[0].page_content[:100].replace("\n", " ") + "..."
                print(f"    [First Chunk Preview]: {preview}")
                
        except Exception as e:
            print(f"  - Error processing {book_name}: {e}")

    print("\nAll text data ingested and stored in PostgreSQL successfully!")

if __name__ == "__main__":
    create_vector_db()
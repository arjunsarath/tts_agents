import os
import glob
import hashlib

import anthropic
import chromadb
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from pypdf import PdfReader

router = APIRouter()

DATA_DIR = os.path.join(os.path.dirname(__file__), "..", "data", "regulatory_docs")
PERSIST_DIR = os.path.join(os.path.dirname(__file__), "..", "vectorstore")

client = anthropic.Anthropic()
chroma_client = chromadb.PersistentClient(path=PERSIST_DIR)
collection = None


def init_vectorstore():
    """Load all regulatory docs into ChromaDB on startup."""
    global collection
    collection = chroma_client.get_or_create_collection(
        name="regulatory_docs",
        metadata={"hnsw:space": "cosine"},
    )
    _ingest_all_documents()


def rebuild_vectorstore():
    """Delete and rebuild the entire vector store from current files."""
    global collection
    chroma_client.delete_collection("regulatory_docs")
    collection = chroma_client.create_collection(
        name="regulatory_docs",
        metadata={"hnsw:space": "cosine"},
    )
    _ingest_all_documents()


def _ingest_all_documents():
    """Scan data dir for .txt and .pdf files and ingest any new ones."""
    if collection is None:
        return

    existing_sources = set()
    if collection.count() > 0:
        all_meta = collection.get(include=["metadatas"])
        existing_sources = {m["source"] for m in all_meta["metadatas"]}

    txt_files = glob.glob(os.path.join(DATA_DIR, "*.txt"))
    pdf_files = glob.glob(os.path.join(DATA_DIR, "*.pdf"))
    all_files = txt_files + pdf_files

    if not all_files:
        print("No regulatory documents found in", DATA_DIR)
        return

    documents = []
    metadatas = []
    ids = []

    for filepath in all_files:
        filename = os.path.basename(filepath)
        if filename in existing_sources:
            continue

        text = _extract_text(filepath)
        if not text.strip():
            print(f"Warning: No text extracted from {filename}, skipping.")
            continue

        chunks = _chunk_text(text, chunk_size=800, overlap=150)
        for i, chunk in enumerate(chunks):
            chunk_id = hashlib.md5(f"{filename}:{i}".encode()).hexdigest()
            documents.append(chunk)
            metadatas.append({"source": filename, "chunk_index": i})
            ids.append(chunk_id)

    if documents:
        # ChromaDB auto-embeds using its default embedding function (all-MiniLM-L6-v2)
        collection.add(documents=documents, metadatas=metadatas, ids=ids)
        new_sources = {m["source"] for m in metadatas}
        print(f"Ingested {len(documents)} chunks from {len(new_sources)} new files.")
    else:
        print(f"Vector store has {collection.count()} chunks. No new files to ingest.")


def _extract_text(filepath: str) -> str:
    """Extract text from .txt or .pdf files."""
    ext = os.path.splitext(filepath)[1].lower()

    if ext == ".txt":
        with open(filepath, "r", encoding="utf-8") as f:
            return f.read()

    if ext == ".pdf":
        try:
            reader = PdfReader(filepath)
            pages = []
            for page in reader.pages:
                text = page.extract_text()
                if text:
                    pages.append(text)
            return "\n\n".join(pages)
        except Exception as e:
            print(f"Error reading PDF {filepath}: {e}")
            return ""

    return ""


def _chunk_text(text: str, chunk_size: int = 800, overlap: int = 150) -> list[str]:
    """Split text into overlapping chunks, trying to break at paragraph boundaries."""
    paragraphs = text.split("\n\n")
    chunks = []
    current_chunk = ""

    for para in paragraphs:
        para = para.strip()
        if not para:
            continue

        if len(current_chunk) + len(para) + 2 <= chunk_size:
            current_chunk = current_chunk + "\n\n" + para if current_chunk else para
        else:
            if current_chunk:
                chunks.append(current_chunk.strip())
            # If a single paragraph is longer than chunk_size, split it by sentences
            if len(para) > chunk_size:
                words = para.split()
                current_chunk = ""
                for word in words:
                    if len(current_chunk) + len(word) + 1 > chunk_size:
                        chunks.append(current_chunk.strip())
                        # Keep overlap from end of previous chunk
                        overlap_words = current_chunk.split()[-overlap // 5 :] if overlap else []
                        current_chunk = " ".join(overlap_words) + " " + word
                    else:
                        current_chunk = current_chunk + " " + word if current_chunk else word
            else:
                # Start new chunk with overlap from end of previous
                if chunks:
                    prev_words = chunks[-1].split()
                    overlap_text = " ".join(prev_words[-(overlap // 5) :]) if len(prev_words) > overlap // 5 else ""
                    current_chunk = overlap_text + "\n\n" + para if overlap_text else para
                else:
                    current_chunk = para

    if current_chunk.strip():
        chunks.append(current_chunk.strip())

    return chunks


class ChatRequest(BaseModel):
    message: str


class ChatResponse(BaseModel):
    reply: str
    sources: list[str]


SYSTEM_PROMPT = """You are a compliance and regulatory research assistant for TTS, a cross-border remittance company operating across 6 continents.

CRITICAL RULES:
1. Answer ONLY using information from the provided context documents. Do NOT use your general knowledge.
2. If the context does not contain sufficient information to answer the question, explicitly state: "I don't have enough information in the loaded documents to answer this question. Please upload relevant regulatory documents to the knowledge base."
3. Do NOT fabricate, infer, or guess regulatory details that are not in the context.
4. Always cite the source document filename when referencing specific information.
5. Structure your answers with clear headings, numbered lists, or bullet points for readability.
6. When quoting specific thresholds, dates, or requirements, indicate which document they come from.

You are grounded strictly in the provided documents. Accuracy is paramount — wrong regulatory guidance is worse than no guidance."""


@router.post("/chat", response_model=ChatResponse)
def compliance_chat(req: ChatRequest):
    if not collection or collection.count() == 0:
        raise HTTPException(
            status_code=503,
            detail="No regulatory documents loaded. Please upload documents to the knowledge base first.",
        )

    # Retrieve relevant chunks
    results = collection.query(query_texts=[req.message], n_results=8)

    context_chunks = results["documents"][0] if results["documents"] else []
    sources_raw = results["metadatas"][0] if results["metadatas"] else []
    distances = results["distances"][0] if results.get("distances") else []

    # Filter out low-relevance chunks (high distance = low relevance)
    filtered_chunks = []
    filtered_sources = []
    for i, chunk in enumerate(context_chunks):
        if distances and distances[i] > 1.5:
            continue
        filtered_chunks.append(chunk)
        filtered_sources.append(sources_raw[i])

    if not filtered_chunks:
        return ChatResponse(
            reply="I couldn't find any relevant information in the loaded documents for your question. Please try rephrasing your query or upload relevant regulatory documents.",
            sources=[],
        )

    sources = list({m["source"] for m in filtered_sources})
    context = "\n\n---\n\n".join(filtered_chunks)

    message = client.messages.create(
        model="claude-haiku-4-5-20251001",
        max_tokens=1024,
        system=SYSTEM_PROMPT,
        messages=[
            {
                "role": "user",
                "content": (
                    f"The following are excerpts from regulatory documents in our knowledge base:\n\n"
                    f"{context}\n\n"
                    f"---\n\n"
                    f"Based ONLY on the above document excerpts, answer this question:\n{req.message}"
                ),
            }
        ],
    )

    reply = message.content[0].text
    return ChatResponse(reply=reply, sources=sources)

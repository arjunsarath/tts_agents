import os
import glob
import hashlib

import anthropic
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from pypdf import PdfReader

router = APIRouter()

DATA_DIR = os.path.join(os.path.dirname(__file__), "..", "data", "regulatory_docs")

client = anthropic.Anthropic()

# In-memory store
_chunks = []        # list of text strings
_metadata = []      # list of {"source": filename, "chunk_index": i}
_vectorizer = None  # TfidfVectorizer
_tfidf_matrix = None  # sparse matrix


def init_vectorstore():
    """Load all regulatory docs into TF-IDF index on startup."""
    _ingest_all_documents()


def rebuild_vectorstore():
    """Rebuild the entire index from current files."""
    global _chunks, _metadata, _vectorizer, _tfidf_matrix
    _chunks = []
    _metadata = []
    _vectorizer = None
    _tfidf_matrix = None
    _ingest_all_documents()


def _ingest_all_documents():
    """Scan data dir for .txt and .pdf files and build TF-IDF index."""
    global _chunks, _metadata, _vectorizer, _tfidf_matrix

    txt_files = glob.glob(os.path.join(DATA_DIR, "*.txt"))
    pdf_files = glob.glob(os.path.join(DATA_DIR, "*.pdf"))
    all_files = txt_files + pdf_files

    if not all_files:
        print("No regulatory documents found in", DATA_DIR)
        return

    _chunks = []
    _metadata = []

    for filepath in all_files:
        filename = os.path.basename(filepath)
        text = _extract_text(filepath)
        if not text.strip():
            print(f"Warning: No text extracted from {filename}, skipping.")
            continue

        chunks = _chunk_text(text, chunk_size=800, overlap=150)
        for i, chunk in enumerate(chunks):
            _chunks.append(chunk)
            _metadata.append({"source": filename, "chunk_index": i})

    if _chunks:
        _vectorizer = TfidfVectorizer(stop_words="english", max_features=5000)
        _tfidf_matrix = _vectorizer.fit_transform(_chunks)
        sources = {m["source"] for m in _metadata}
        print(f"Indexed {len(_chunks)} chunks from {len(sources)} files using TF-IDF.")
    else:
        print("No chunks to index.")


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
            if len(para) > chunk_size:
                words = para.split()
                current_chunk = ""
                for word in words:
                    if len(current_chunk) + len(word) + 1 > chunk_size:
                        chunks.append(current_chunk.strip())
                        overlap_words = current_chunk.split()[-overlap // 5 :] if overlap else []
                        current_chunk = " ".join(overlap_words) + " " + word
                    else:
                        current_chunk = current_chunk + " " + word if current_chunk else word
            else:
                if chunks:
                    prev_words = chunks[-1].split()
                    overlap_text = " ".join(prev_words[-(overlap // 5) :]) if len(prev_words) > overlap // 5 else ""
                    current_chunk = overlap_text + "\n\n" + para if overlap_text else para
                else:
                    current_chunk = para

    if current_chunk.strip():
        chunks.append(current_chunk.strip())

    return chunks


def _search(query: str, n_results: int = 8, threshold: float = 0.05):
    """Search chunks using TF-IDF cosine similarity."""
    if not _chunks or _vectorizer is None or _tfidf_matrix is None:
        return [], []

    query_vec = _vectorizer.transform([query])
    scores = cosine_similarity(query_vec, _tfidf_matrix).flatten()

    # Get top n indices sorted by score
    top_indices = np.argsort(scores)[::-1][:n_results]

    result_chunks = []
    result_meta = []
    for idx in top_indices:
        if scores[idx] < threshold:
            continue
        result_chunks.append(_chunks[idx])
        result_meta.append(_metadata[idx])

    return result_chunks, result_meta


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
    if not _chunks:
        raise HTTPException(
            status_code=503,
            detail="No regulatory documents loaded. Please upload documents to the knowledge base first.",
        )

    filtered_chunks, filtered_sources = _search(req.message, n_results=8)

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

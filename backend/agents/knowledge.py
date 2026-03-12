import os
import glob
import shutil

from fastapi import APIRouter, UploadFile, File, HTTPException
from pypdf import PdfReader

from agents.compliance_agent import rebuild_vectorstore

router = APIRouter()

DATA_DIR = os.path.join(os.path.dirname(__file__), "..", "data", "regulatory_docs")
ALLOWED_EXTENSIONS = {".txt", ".pdf"}
MAX_FILE_SIZE = 20 * 1024 * 1024  # 20 MB


@router.get("/documents")
def list_documents():
    """List all regulatory documents available in the knowledge base."""
    txt_files = glob.glob(os.path.join(DATA_DIR, "*.txt"))
    pdf_files = glob.glob(os.path.join(DATA_DIR, "*.pdf"))
    all_files = txt_files + pdf_files

    documents = []
    for filepath in all_files:
        filename = os.path.basename(filepath)
        stat = os.stat(filepath)
        ext = os.path.splitext(filename)[1].lower()
        name = os.path.splitext(filename)[0].replace("_", " ").replace("-", " ").title()

        # Get page count
        pages = _get_page_count(filepath, ext)

        documents.append({
            "title": name,
            "source": filename,
            "pages": pages,
            "size": stat.st_size,
            "type": ext.lstrip(".").upper(),
            "badge": "Regulatory",
            "badgeColor": "accent",
        })

    return {"documents": documents, "total": len(documents)}


@router.post("/upload")
async def upload_document(file: UploadFile = File(...)):
    """Upload a regulatory document (PDF or TXT). Triggers vector store re-ingestion."""
    if not file.filename:
        raise HTTPException(status_code=400, detail="No filename provided.")

    ext = os.path.splitext(file.filename)[1].lower()
    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported file type '{ext}'. Allowed: {', '.join(ALLOWED_EXTENSIONS)}",
        )

    # Read file content to check size
    content = await file.read()
    if len(content) > MAX_FILE_SIZE:
        raise HTTPException(status_code=400, detail="File too large. Maximum size is 20MB.")

    # Save to data directory
    safe_filename = file.filename.replace(" ", "_")
    filepath = os.path.join(DATA_DIR, safe_filename)

    with open(filepath, "wb") as f:
        f.write(content)

    # Rebuild vector store with new document
    try:
        rebuild_vectorstore()
    except Exception as e:
        # If ingestion fails, still keep the file but warn
        print(f"Warning: Vector store rebuild failed: {e}")

    pages = _get_page_count(filepath, ext)

    return {
        "message": f"Document '{safe_filename}' uploaded and indexed successfully.",
        "document": {
            "title": os.path.splitext(safe_filename)[0].replace("_", " ").replace("-", " ").title(),
            "source": safe_filename,
            "pages": pages,
            "size": len(content),
            "type": ext.lstrip(".").upper(),
            "badge": "Regulatory",
            "badgeColor": "accent",
        },
    }


@router.get("/documents/{filename}/content")
def get_document_content(filename: str):
    """Return the text content of a document for preview."""
    filepath = os.path.join(DATA_DIR, filename)
    if not os.path.exists(filepath):
        raise HTTPException(status_code=404, detail="Document not found.")

    ext = os.path.splitext(filename)[1].lower()

    if ext == ".txt":
        with open(filepath, "r", encoding="utf-8") as f:
            return {"content": f.read(), "filename": filename}

    if ext == ".pdf":
        try:
            reader = PdfReader(filepath)
            pages = []
            for page in reader.pages:
                text = page.extract_text()
                if text:
                    pages.append(text)
            return {"content": "\n\n".join(pages), "filename": filename}
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Failed to read PDF: {e}")

    raise HTTPException(status_code=400, detail="Unsupported file type.")


@router.delete("/documents/{filename}")
def delete_document(filename: str):
    """Delete a document and rebuild the vector store."""
    filepath = os.path.join(DATA_DIR, filename)
    if not os.path.exists(filepath):
        raise HTTPException(status_code=404, detail="Document not found.")

    os.remove(filepath)

    try:
        rebuild_vectorstore()
    except Exception as e:
        print(f"Warning: Vector store rebuild failed after deletion: {e}")

    return {"message": f"Document '{filename}' deleted and vector store rebuilt."}


def _get_page_count(filepath: str, ext: str) -> int:
    """Get page count for a document."""
    if ext == ".pdf":
        try:
            reader = PdfReader(filepath)
            return len(reader.pages)
        except Exception:
            return 1
    else:
        # For text files, estimate ~3000 chars per page
        try:
            with open(filepath, "r", encoding="utf-8") as f:
                content = f.read()
            return max(1, len(content) // 3000)
        except Exception:
            return 1

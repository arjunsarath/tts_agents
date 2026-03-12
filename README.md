# TapTap Send AI Platform

Internal AI transformation platform for TapTap Send, a cross-border remittance company. Built as a working prototype demonstrating how AI tools can accelerate compliance, research, and team productivity.

## Features

- **Compliance & Regulatory Agent** — RAG-powered chat that answers compliance questions grounded in uploaded regulatory documents (FATF, KYC/AML, UK MSR)
- **AI Adoption Copilot** — Prompt library, tool recommender, and prompt improver powered by Claude
- **Approved Stack** — Curated list of 25 AI tools across 9 categories approved for use across the organization
- **Knowledge Base** — Upload, preview, and manage regulatory documents with automatic chunking, embedding, and vector indexing
- **Documentation** — Project overview explaining what was built and how

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React + Vite + Tailwind CSS v4 |
| Backend | Python + FastAPI |
| AI | Anthropic Claude (Haiku) |
| Vector DB | ChromaDB with sentence-transformers |
| Hosting | Vercel (frontend) + Render (backend) |

## Project Structure

```
tts/
├── frontend/          # React SPA
│   └── src/
│       ├── pages/     # Landing, Login, ComplianceAgent, AdoptionCopilot, etc.
│       ├── components/# Sidebar, AppLayout
│       └── context/   # AuthContext
├── backend/
│   ├── main.py        # FastAPI entry point
│   ├── agents/
│   │   ├── compliance_agent.py  # RAG pipeline + Claude chat
│   │   ├── adoption_copilot.py  # Tool recommender + prompt improver
│   │   └── knowledge.py         # Document CRUD + vectorstore rebuild
│   └── data/
│       ├── regulatory_docs/     # Uploaded compliance documents
│       ├── approved_tools.json  # Approved AI tools list
│       └── prompt_library.json  # Curated prompt templates
```

## Local Development

### Backend

```bash
cd backend
python -m venv venv && source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env  # Add your ANTHROPIC_API_KEY
uvicorn main:app --reload
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on `http://localhost:5173` with API proxy to `http://localhost:8000`.

## Login Credentials

| Username | Password |
|----------|----------|
| admin | TTS@2026! |
| arjun | taptap |
| demo | TapSend#24 |

## Deployment

- **Frontend**: Vercel — set `VITE_API_URL` env var to backend URL
- **Backend**: Render — set `ANTHROPIC_API_KEY` env var

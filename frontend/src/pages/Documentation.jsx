import { BookOpen, ShieldCheck, Sparkles, Database, Layers, Zap, Server, Globe } from 'lucide-react'

const SECTIONS = [
  {
    title: 'Project Overview',
    icon: Layers,
    content: `This is a working proof-of-concept demonstrating a comprehensive AI transformation roadmap for TapTap Send — a cross-border fintech powering remittances across 6 continents. Rather than a static document, it's a live web experience: a strategic AI adoption plan paired with two functional AI agents that teams can use immediately.

The goal is simple: show, don't tell. Built in 2 days to demonstrate what's possible when AI meets fintech operations.`,
  },
  {
    title: 'Compliance & Regulatory Agent',
    icon: ShieldCheck,
    content: `A RAG-based (Retrieval-Augmented Generation) conversational agent that answers questions about remittance regulations across TapTap Send's key corridors.

How it works:
• Regulatory documents (PDF/TXT) are uploaded to the Knowledge Base
• Documents are chunked into ~800-token segments with 150-token overlap for context continuity
• Chunks are embedded using all-MiniLM-L6-v2 and stored in ChromaDB (cosine similarity)
• When a user asks a question, the top 8 most relevant chunks are retrieved
• Low-relevance chunks are filtered out using distance thresholds
• Retrieved context is passed to Claude Haiku with strict grounding instructions
• The model answers ONLY from the provided documents — never from general knowledge
• Source documents are cited in every response`,
  },
  {
    title: 'AI Adoption Copilot',
    icon: Sparkles,
    content: `An internal-facing tool with three capabilities to help every team adopt AI effectively:

Prompt Library — A curated, filterable collection of prompt templates organized by team (Compliance, Operations, Finance, Growth, Research, General). Each prompt includes the template, target model, and description. Served from a structured JSON database.

Tool Recommender — Describe a task in plain English and the agent recommends 1-3 AI tools from the approved stack (Claude Sonnet, Claude Haiku, ChromaDB, Python/FastAPI, Slack Automations, etc). Returns structured recommendations with a suggested approach and estimated time savings. Powered by Claude Sonnet.

Prompt Improver — Paste a basic prompt and get back an optimized version with: role/persona assignment, structured analysis instructions, output format requirements, and edge case handling. Returns labeled sections for clear visualization. Powered by Claude Sonnet.`,
  },
  {
    title: 'Knowledge Base',
    icon: Database,
    content: `The document management layer powering the RAG pipeline:

• Upload PDF and TXT regulatory documents through the web interface
• Documents are automatically parsed, chunked, embedded, and indexed on upload
• Full ingestion pipeline is visualized step-by-step during upload
• Click any document to preview its extracted text content
• Delete documents to remove them from both storage and the vector index
• The vector store rebuilds automatically on any change (upload or delete)
• ChromaDB with persistent storage ensures embeddings survive server restarts`,
  },
  {
    title: 'Technical Architecture',
    icon: Server,
    content: `Frontend: React 18 + Vite + Tailwind CSS v4
• Single-page application with React Router v6
• Protected routes with simple auth context (hardcoded users for demo)
• Component architecture: AppLayout (Sidebar + Outlet) wrapping all authenticated pages

Backend: Python FastAPI
• /api/compliance/chat — RAG pipeline (retrieve → generate with Claude Haiku)
• /api/knowledge/documents — List, upload, preview, delete documents
• /api/copilot/prompts — Prompt library from structured JSON
• /api/copilot/recommend — Tool recommendations via Claude Sonnet
• /api/copilot/improve — Prompt improvement via Claude Sonnet

AI & Data:
• Anthropic Claude API — Haiku for compliance (fast, cost-effective), Sonnet for copilot (stronger reasoning)
• ChromaDB — Persistent vector store with cosine similarity search
• all-MiniLM-L6-v2 — Default embedding model via ChromaDB
• pypdf — PDF text extraction for document ingestion`,
  },
  {
    title: 'Data Sources',
    icon: Globe,
    content: `All agent capabilities are built on publicly available external data:

Compliance Agent:
• FATF Recommendations (Recommendation 16 on wire transfers)
• Bank Al-Maghrib circulars (Morocco KYC/AML requirements)
• FCA Payment Services Regulations 2017 (UK MSB regulations)
• Additional regulatory PDFs can be uploaded through the Knowledge Base

With access to TapTap Send's internal documentation, SOPs, and compliance databases, these agents would become dramatically more powerful. The architecture is designed to drop in internal data sources without changing the underlying system.`,
  },
  {
    title: 'What Comes Next',
    icon: Zap,
    content: `This demo uses only public data. With access to internal systems, immediate next steps would be:

1. Connect to internal knowledge bases — compliance playbooks, operational SOPs, corridor launch checklists
2. Integrate with Slack — deploy agents as Slack bots for zero-friction access
3. Add transaction monitoring — AI-assisted anomaly detection on live data
4. Build cross-functional agent workflows — automate the corridor launch pipeline end-to-end
5. Expand the prompt library — incorporate real team workflows and winning prompts
6. Establish AI transformation KPIs — dashboard tracking adoption, time saved, and output quality`,
  },
]

export default function Documentation() {
  return (
    <div className="h-full bg-surface overflow-y-auto">
      <div className="max-w-3xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-light/30 text-accent text-xs font-medium mb-3">
            <BookOpen size={12} />
            Documentation
          </div>
          <h1 className="text-heading font-bold text-[28px] leading-tight">
            TapTap Send AI Platform
          </h1>
          <p className="text-body text-sm mt-2 leading-relaxed">
            A comprehensive AI transformation demo — built by Arjun to show what's possible when AI meets cross-border payments. Two working agents, a strategic roadmap, and a full RAG pipeline, delivered in 2 days.
          </p>
        </div>

        {/* Sections */}
        <div className="space-y-6">
          {SECTIONS.map((section) => {
            const Icon = section.icon
            return (
              <article
                key={section.title}
                className="bg-white border border-border rounded-xl p-6"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-accent-light/30 flex items-center justify-center shrink-0">
                    <Icon size={16} className="text-accent" />
                  </div>
                  <h2 className="text-heading font-semibold text-base">{section.title}</h2>
                </div>
                <div className="text-body text-sm leading-relaxed whitespace-pre-line">
                  {section.content}
                </div>
              </article>
            )
          })}
        </div>

        {/* Footer */}
        <p className="text-center text-muted text-xs mt-10 mb-4">
          Built by Arjun &middot; React + FastAPI + ChromaDB + Anthropic Claude
        </p>
      </div>
    </div>
  )
}

# TapTap Send — AI Transformation Project

**Prepared by Arjun**
**Date: March 2026**

---

## 1. Executive Summary

This project delivers a live, interactive web experience that demonstrates a comprehensive AI transformation roadmap for TapTap Send — the cross-border fintech powering remittances across 6 continents. Rather than a static document, this is a working proof-of-concept: a website that combines a strategic AI adoption plan with two functional AI agents that TapTap Send teams can use immediately.

The goal is simple: **show, don't tell.** The adoption plan maps where AI can eliminate toil and accelerate decisions across every function. The agents prove it's possible — built in days, not months.

---

## 2. The Problem

TapTap Send has 50+ people across research, data, operations, compliance, growth, and finance. Most workflows still run on human effort and manual processes. Two pain points stand out:

- **Compliance & Regulatory Research** — Every new corridor requires deep research into KYC/AML frameworks, central bank rules, licensing requirements, and FATF guidelines. This is slow, repetitive, and high-stakes. Analysts spend hours reading regulatory documents that could be retrieved and synthesized in seconds.

- **AI Adoption Across Teams** — Even when teams want to use AI, they don't know where to start. There's no shared prompt library, no internal best practices, no tool recommendations. Every person is reinventing the wheel — or not trying at all.

---

## 3. The Solution — Three Deliverables

### 3.1 AI Adoption Roadmap (Landing Page)

A modern, presentation-style landing page that walks through a phased AI transformation plan for TapTap Send. This isn't generic "AI is the future" content — it's mapped to TapTap Send's actual functions, corridors, and stage of growth.

**Phased Roadmap:**

**Phase 1 — Quick Wins (Weeks 1–4)**
- Deploy AI copilots for compliance document review and regulatory Q&A
- Introduce prompt libraries for operations, finance, and growth teams
- Set up AI-assisted meeting summaries and action item extraction
- Automate repetitive Slack workflows (status updates, data pulls, report formatting)

**Phase 2 — Workflow Transformation (Months 2–3)**
- Build RAG pipelines over internal knowledge bases (compliance docs, operational playbooks, corridor research)
- Deploy automated QA pipelines for transaction monitoring
- Implement AI-assisted customer support triage and response drafting
- Create an internal AI training programme: office hours, templates, prompt engineering workshops

**Phase 3 — Strategic Integration (Months 4–6)**
- Develop cross-functional agent workflows (e.g., new corridor launch pipeline: research → compliance → ops → growth)
- Build automated reporting dashboards with AI-generated insights
- Evaluate and integrate third-party AI tooling (coding assistants, analytics copilots)
- Establish AI transformation KPIs with board-level reporting

**Function-by-Function Opportunity Map:**

| Function | Current State | AI Opportunity | Expected Impact |
|---|---|---|---|
| **Compliance** | Manual regulatory research, document-by-document review | RAG-based regulatory Q&A, automated compliance checks, document summarization | 60–70% reduction in research time per corridor |
| **Operations** | Manual transaction monitoring, human-driven QA | Automated anomaly detection, AI-assisted QA pipelines, smart routing | 40–50% faster issue resolution |
| **Growth/Marketing** | Manual competitor research, campaign creation | Competitor intelligence agents, AI-generated copy, A/B test analysis | 3x faster campaign iteration |
| **Finance** | Manual reporting, spreadsheet-heavy analysis | Automated report generation, natural language data queries | 50% reduction in reporting cycles |
| **Research/Data** | Manual corridor analysis, market sizing | AI-assisted research copilots, automated data synthesis | 2x more corridors evaluated per quarter |
| **Customer Support** | Manual ticket handling, FAQ responses | AI-powered triage, draft responses, sentiment analysis | 30–40% faster first response time |

---

### 3.2 Agent 1 — Compliance & Regulatory Research Agent

**What it does:**
A conversational AI agent that answers questions about remittance regulations across TapTap Send's key corridors. Built on a RAG (Retrieval-Augmented Generation) architecture over publicly available regulatory documents.

**Data Sources:**
- FATF (Financial Action Task Force) guidelines and recommendations
- Central bank regulations for key corridors (Bank of England, Bank Al-Maghrib, State Bank of Pakistan, Central Bank of UAE, etc.)
- KYC/AML frameworks by jurisdiction
- Money transfer licensing requirements across operating countries
- EU Anti-Money Laundering Directives
- US FinCEN regulations and MSB requirements

**Key Corridors Covered:**
- UK → Morocco, Pakistan, Bangladesh, Ghana, Nigeria
- UAE → Pakistan, India, Philippines, Bangladesh
- US → Mexico, Guatemala, Honduras, El Salvador
- EU → Morocco, Senegal, Cameroon
- Canada → Philippines, India, Nigeria

**Example Queries:**
- "What are the KYC requirements for remittances to Morocco?"
- "Compare AML reporting thresholds: UK vs UAE vs US"
- "What licensing is required to operate as a money transfer service in Ghana?"
- "Summarize FATF Recommendation 16 on wire transfers"
- "What are the customer due diligence requirements for high-risk corridors?"

**Technical Architecture:**
- **Embeddings:** Text chunks from regulatory documents embedded using a sentence transformer model
- **Vector Store:** ChromaDB for fast similarity search
- **LLM:** Anthropic Claude 3.5 Haiku (fast, cost-effective for retrieval-heavy tasks)
- **Backend:** Python FastAPI endpoint handling query → retrieval → generation pipeline
- **Frontend:** React chat interface with pre-loaded example queries

**Why This Matters for TapTap Send:**
Compliance is the single biggest bottleneck in launching new corridors. Every new market requires weeks of regulatory research. This agent doesn't replace compliance analysts — it gives them a research copilot that retrieves relevant regulations in seconds instead of hours, letting them focus on judgment and decision-making.

---

### 3.3 Agent 2 — AI Adoption Copilot

**What it does:**
An internal-facing tool that helps every team at TapTap Send start using AI effectively. Three capabilities in one interface:

**Capability A — Prompt Library**
A curated, searchable collection of prompts organized by team and use case:

- **Compliance:** Regulatory summarization, policy comparison, risk assessment drafting
- **Operations:** Incident report writing, process documentation, SOP generation
- **Finance:** Financial narrative generation, variance analysis prompts, board report drafting
- **Growth:** Campaign copy generation, competitor analysis, user research synthesis
- **Research/Data:** Market sizing prompts, data cleaning instructions, analysis frameworks
- **General:** Meeting summary, email drafting, document review, brainstorming

Each prompt includes: the template, example input/output, which model works best, and tips for customization.

**Capability B — Tool Recommender**
Describe a task in plain English, and the copilot recommends the right AI tool and approach:

- Input: "I need to summarize 50 customer support tickets to find patterns"
- Output: Recommended tool (Claude/GPT), suggested approach (batch processing with structured output), example prompt, estimated time saved

**Capability C — Prompt Improver**
Paste a basic prompt, get back an optimized version with:
- Clearer instructions
- Structured output format
- Relevant context framing
- Role/persona assignment
- Edge case handling

**Technical Architecture:**
- **LLM:** Anthropic Claude 3.5 Sonnet (stronger reasoning for prompt optimization and recommendations)
- **Backend:** Python FastAPI with structured prompt engineering
- **Frontend:** React tabbed interface (Library / Recommender / Improver)
- **Data:** Curated prompt database stored as structured JSON

**Why This Matters for TapTap Send:**
The JD explicitly calls for "an internal AI adoption programme — training, templates, prompt libraries, office hours." This agent IS that programme, delivered as a product rather than a PowerPoint. It lowers the barrier to AI adoption from "figure it out yourself" to "describe what you need."

---

## 4. Technical Architecture (Full Stack)

```
┌─────────────────────────────────────────────┐
│              FRONTEND (React + Vite)         │
│          Hosted on Vercel (Free Tier)        │
│                                              │
│  ┌──────────┐ ┌──────────┐ ┌──────────────┐ │
│  │ Landing  │ │Compliance│ │  Adoption    │ │
│  │  Page    │ │  Agent   │ │  Copilot     │ │
│  └──────────┘ └──────────┘ └──────────────┘ │
└─────────────────┬───────────────────────────┘
                  │ REST API
┌─────────────────▼───────────────────────────┐
│              BACKEND (Python FastAPI)         │
│          Hosted on Render (Free Tier)        │
│                                              │
│  ┌──────────────┐  ┌─────────────────────┐  │
│  │ Compliance   │  │ Adoption Copilot    │  │
│  │ Agent Router │  │ Router              │  │
│  │              │  │  - Prompt Library   │  │
│  │ ChromaDB     │  │  - Tool Recommender │  │
│  │ (Vector DB)  │  │  - Prompt Improver  │  │
│  └──────┬───────┘  └──────────┬──────────┘  │
│         │                     │              │
│  ┌──────▼─────────────────────▼──────────┐  │
│  │        Anthropic Claude API            │  │
│  │   Haiku (compliance) | Sonnet (copilot)│  │
│  └───────────────────────────────────────┘  │
└─────────────────────────────────────────────┘
```

**Project Structure:**
```
taptap-ai-demo/
├── backend/
│   ├── main.py                  # FastAPI app, CORS, routes
│   ├── agents/
│   │   ├── compliance_agent.py  # RAG pipeline
│   │   └── adoption_copilot.py  # Prompt library, recommender, improver
│   ├── data/
│   │   ├── regulatory_docs/     # Public regulatory text files
│   │   └── prompt_library.json  # Curated prompts by function
│   ├── vectorstore/             # ChromaDB persistence
│   ├── requirements.txt
│   └── Dockerfile               # For Render deployment
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── pages/
│   │   │   ├── Landing.jsx      # Presentation-style landing
│   │   │   ├── ComplianceAgent.jsx
│   │   │   └── AdoptionCopilot.jsx
│   │   ├── components/
│   │   │   ├── ChatInterface.jsx
│   │   │   ├── PromptLibrary.jsx
│   │   │   ├── ToolRecommender.jsx
│   │   │   └── PromptImprover.jsx
│   │   └── styles/
│   ├── package.json
│   ├── vite.config.js
│   └── vercel.json
└── README.md
```

---

## 5. Data Strategy

Since we don't have access to TapTap Send's internal data, all agent capabilities are built on **publicly available external data**:

**For the Compliance Agent:**
- FATF Recommendations and Mutual Evaluation Reports
- Public central bank circulars and regulations
- Published KYC/AML frameworks by jurisdiction
- EU AML Directive summaries
- FinCEN guidance documents
- World Bank remittance regulatory data

**For the Adoption Copilot:**
- Industry-standard prompt engineering best practices
- Publicly documented AI tool capabilities
- Fintech-specific AI use case libraries
- General productivity automation patterns

**Important Note:** This is a demonstration of capability. With access to TapTap Send's internal documentation, SOPs, and compliance databases, these agents would become dramatically more powerful. The architecture is designed to drop in internal data sources without changing the underlying system.

---

## 6. Cost Estimate

**API Costs (Anthropic):**
- Claude 3.5 Haiku (compliance agent): ~$0.25/M input tokens, $1.25/M output tokens
- Claude 3.5 Sonnet (adoption copilot): ~$3/M input tokens, $15/M output tokens
- Estimated demo usage (200 total queries): **Under $2**

**Hosting Costs:**
- Vercel (frontend): Free tier — 100GB bandwidth/month
- Render (backend): Free tier — 750 hours/month
- **Total hosting: $0**

**Total Cost to Run This Demo: ~$2**

---

## 7. Success Metrics

If deployed internally, these agents would be measured on:

| Metric | Baseline (Manual) | Target (AI-Augmented) |
|---|---|---|
| Regulatory research time per corridor | 2–3 weeks | 2–3 days |
| Time to first AI tool usage (new employee) | Never / ad hoc | Day 1 (via copilot) |
| Teams actively using AI in workflows | ~10% | 80%+ within 3 months |
| Compliance document review time | 4–6 hours per doc | 30–60 minutes |
| Prompt quality across teams | Inconsistent | Standardized via library |

---

## 8. Timeline

| Day | Deliverable |
|---|---|
| **Day 1** | Backend: FastAPI setup, compliance agent RAG pipeline, regulatory data ingestion, adoption copilot logic, prompt library |
| **Day 1** | Frontend: Landing page design, chat interface components, copilot tabs |
| **Day 2** | Integration testing, deployment to Vercel + Render, end-to-end QA, polish |
| **Day 2** | Final review, URL ready to share |

---

## 9. Why This Approach

This project directly mirrors what the Founders Associate – AI role requires:

| JD Requirement | This Project Demonstrates |
|---|---|
| "Audit every team and function to map where AI can eliminate toil" | The function-by-function opportunity map on the landing page |
| "Build and deploy AI agents" | Two working agents, deployed and accessible |
| "Own the full stack: scoping, prototyping, building, deploying" | End-to-end from strategy to live product |
| "Design and run an internal AI adoption programme" | The Adoption Copilot IS the programme |
| "Bias for speed and pragmatism over perfection" | Built and shipped in 2 days |
| "Stay relentlessly current on the frontier" | RAG architecture, Claude API, modern stack |
| "Experience with MCP, agent-to-agent communication" | Architecture designed for extensibility |

---

## 10. What Comes Next (With Internal Access)

This demo uses only public data. With access to TapTap Send's internal systems, the immediate next steps would be:

1. **Connect to internal knowledge bases** — Compliance playbooks, operational SOPs, corridor launch checklists
2. **Integrate with Slack** — Deploy agents as Slack bots for zero-friction access
3. **Add transaction monitoring** — AI-assisted anomaly detection on live transaction data
4. **Build cross-functional agent workflows** — Automate the corridor launch pipeline end-to-end
5. **Expand the prompt library** — Incorporate real team workflows and winning prompts
6. **Set up AI transformation KPIs** — Dashboard tracking adoption, time saved, and output quality

---

*Built by Arjun — to show what's possible when AI meets fintech operations.*

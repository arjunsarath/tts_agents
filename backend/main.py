import os
from contextlib import asynccontextmanager

from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

load_dotenv()

from agents.compliance_agent import router as compliance_router, init_vectorstore
from agents.adoption_copilot import router as copilot_router
from agents.knowledge import router as knowledge_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    init_vectorstore()
    yield


app = FastAPI(title="TTS AI Platform", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(compliance_router, prefix="/api/compliance", tags=["compliance"])
app.include_router(copilot_router, prefix="/api/copilot", tags=["copilot"])
app.include_router(knowledge_router, prefix="/api/knowledge", tags=["knowledge"])


@app.get("/api/health")
def health():
    return {"status": "ok"}

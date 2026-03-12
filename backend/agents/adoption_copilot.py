import json
import os

import anthropic
from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter()

client = anthropic.Anthropic()

PROMPT_LIBRARY_PATH = os.path.join(os.path.dirname(__file__), "..", "data", "prompt_library.json")
TOOLS_PATH = os.path.join(os.path.dirname(__file__), "..", "data", "approved_tools.json")

SONNET_MODEL = "claude-haiku-4-5-20251001"


# --- Prompt Library ---

@router.get("/prompts")
def get_prompts(category: str | None = None):
    with open(PROMPT_LIBRARY_PATH, "r") as f:
        prompts = json.load(f)
    if category and category != "All":
        prompts = [p for p in prompts if p["category"] == category]
    return prompts


# --- Approved Tools ---

@router.get("/tools")
def get_tools():
    with open(TOOLS_PATH, "r") as f:
        return json.load(f)


# --- Tool Recommender ---

class RecommendRequest(BaseModel):
    task: str


@router.post("/recommend")
def recommend_tools(req: RecommendRequest):
    with open(TOOLS_PATH, "r") as f:
        tools = json.load(f)

    tools_context = "\n".join(
        f"- {t['name']}: {t['description']} (Category: {t['category']}, Best for: {t['best_for']})"
        for t in tools
    )

    system_prompt = (
        "You are an AI tool recommender for TTS, a cross-border remittance company. "
        "The user will describe a task. Recommend 1-3 tools ONLY from the approved stack below.\n\n"
        f"APPROVED TOOLS:\n{tools_context}\n\n"
        "RULES:\n"
        "- ONLY recommend tools from the approved list above. Do NOT suggest tools outside this list.\n"
        "- For each recommendation, use the exact tool name from the list.\n"
        "- Explain why each tool fits the described task.\n"
        "- Provide a step-by-step approach using the recommended tools.\n\n"
        "Respond with ONLY a JSON object, no additional text before or after:\n"
        "{\n"
        '  "recommendations": [\n'
        '    {"name": "exact tool name", "role": "primary|supporting", "description": "why this tool fits the task"}\n'
        "  ],\n"
        '  "approach": ["step 1", "step 2", "step 3"],\n'
        '  "estimated_time_saved": "e.g. 4-6 hours"\n'
        "}\n\n"
        "IMPORTANT: Output ONLY the JSON object. No markdown, no explanation, no text outside the JSON."
    )

    message = client.messages.create(
        model=SONNET_MODEL,
        max_tokens=1024,
        system=system_prompt,
        messages=[{"role": "user", "content": req.task}],
    )

    raw = message.content[0].text

    try:
        start = raw.index("{")
        end = raw.rindex("}") + 1
        data = json.loads(raw[start:end])
        return data
    except (json.JSONDecodeError, ValueError):
        return {"raw_response": raw}


# --- Prompt Improver ---

class ImproveRequest(BaseModel):
    prompt: str


@router.post("/improve")
def improve_prompt(req: ImproveRequest):
    system_prompt = (
        "You are a prompt engineering expert helping teams at TTS write better AI prompts. "
        "The user will give you a basic prompt. Return an improved version with:\n"
        "1. A clear role/persona assignment\n"
        "2. Structured analysis instructions\n"
        "3. Specific output format requirements\n"
        "4. Edge case handling\n\n"
        "Respond with ONLY a JSON object, no additional text before or after:\n"
        "{\n"
        '  "sections": [\n'
        '    {"label": "Role", "color": "purple", "content": "..."},\n'
        '    {"label": "Analysis", "color": "blue", "content": "..."},\n'
        '    {"label": "Output Format", "color": "green", "content": "..."},\n'
        '    {"label": "Edge Cases", "color": "amber", "content": "..."}\n'
        "  ],\n"
        '  "improvements": ["Audience defined", "Structured output", "Edge cases", "Constraints"]\n'
        "}\n\n"
        "Tailor the improved prompt to a fintech/remittance company context when relevant.\n"
        "IMPORTANT: Output ONLY the JSON object. No markdown, no explanation, no text outside the JSON."
    )

    message = client.messages.create(
        model=SONNET_MODEL,
        max_tokens=1024,
        system=system_prompt,
        messages=[{"role": "user", "content": req.prompt}],
    )

    raw = message.content[0].text

    try:
        start = raw.index("{")
        end = raw.rindex("}") + 1
        data = json.loads(raw[start:end])
        return data
    except (json.JSONDecodeError, ValueError):
        return {"raw_response": raw}

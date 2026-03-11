import json
from groq import Groq
from app.core.config import settings

client = Groq(api_key=settings.GROQ_API_KEY)

# All available slide types in order
ALL_SLIDE_IDS = ["cover", "problem", "solution", "market", "product",
                 "traction", "business_model", "competition", "team", "ask"]

# Minimum required slides (always included)
REQUIRED = {"cover", "problem", "solution", "ask"}

def get_slides_for_count(count: int) -> list:
    """Return which slide IDs to include for a given count."""
    count = max(4, min(10, count))
    if count >= 10:
        return ALL_SLIDE_IDS[:]
    # Always include required, fill rest in order
    pool = [s for s in ALL_SLIDE_IDS if s not in REQUIRED]
    extras_needed = count - len(REQUIRED)
    selected = list(REQUIRED)
    for s in ALL_SLIDE_IDS:  # preserve order
        if s in selected:
            continue
        if extras_needed <= 0:
            break
        selected.append(s)
        extras_needed -= 1
    return [s for s in ALL_SLIDE_IDS if s in selected]

SYSTEM = """You are an expert startup pitch deck consultant who has helped companies raise millions.
Given a startup idea, generate a complete, compelling pitch deck as structured JSON.
Return ONLY valid JSON, no markdown, no explanation.

The JSON must have this exact shape:
{
  "startup_name": "string",
  "tagline": "string (one punchy line)",
  "slides": [
    {
      "id": "cover",
      "title": "string",
      "subtitle": "string",
      "body": "string"
    },
    {
      "id": "problem",
      "title": "The Problem",
      "stat": "string (e.g. $2.3B lost annually)",
      "body": "string (2-3 sentences)",
      "bullets": ["string", "string", "string"]
    },
    {
      "id": "solution",
      "title": "Our Solution",
      "body": "string",
      "bullets": ["string", "string", "string"]
    },
    {
      "id": "market",
      "title": "Market Opportunity",
      "tam": "string (e.g. $48B)",
      "sam": "string (e.g. $12B)",
      "som": "string (e.g. $1.2B)",
      "body": "string"
    },
    {
      "id": "product",
      "title": "How It Works",
      "steps": [
        {"step": "01", "title": "string", "desc": "string"},
        {"step": "02", "title": "string", "desc": "string"},
        {"step": "03", "title": "string", "desc": "string"}
      ]
    },
    {
      "id": "traction",
      "title": "Traction",
      "metrics": [
        {"label": "string", "value": "string"},
        {"label": "string", "value": "string"},
        {"label": "string", "value": "string"},
        {"label": "string", "value": "string"}
      ],
      "body": "string"
    },
    {
      "id": "business_model",
      "title": "Business Model",
      "revenue_streams": [
        {"name": "string", "desc": "string", "pct": "string"},
        {"name": "string", "desc": "string", "pct": "string"},
        {"name": "string", "desc": "string", "pct": "string"}
      ]
    },
    {
      "id": "competition",
      "title": "Competitive Landscape",
      "body": "string",
      "advantages": ["string", "string", "string", "string"]
    },
    {
      "id": "team",
      "title": "The Team",
      "members": [
        {"name": "string", "role": "string", "background": "string"},
        {"name": "string", "role": "string", "background": "string"},
        {"name": "string", "role": "string", "background": "string"}
      ]
    },
    {
      "id": "ask",
      "title": "The Ask",
      "amount": "string (e.g. $2.5M)",
      "round": "string (e.g. Seed)",
      "use_of_funds": [
        {"category": "string", "pct": 40, "desc": "string"},
        {"category": "string", "pct": 30, "desc": "string"},
        {"category": "string", "pct": 20, "desc": "string"},
        {"category": "string", "pct": 10, "desc": "string"}
      ],
      "vision": "string"
    }
  ]
}

Make everything realistic, specific, and compelling. Use real-sounding numbers and names.
"""

def generate_pitch(idea: str, industry: str, stage: str, slide_count: int = 10) -> dict:
    if slide_count <= 5:
        selected = ["cover","problem","solution","market","ask"]
    elif slide_count <= 7:
        selected = ["cover","problem","solution","market","product","traction","ask"]
    elif slide_count <= 8:
        selected = ["cover","problem","solution","market","product","traction","team","ask"]
    elif slide_count <= 9:
        selected = ["cover","problem","solution","market","product","traction","business_model","team","ask"]
    else:
        selected = ["cover","problem","solution","market","product","traction","business_model","competition","team","ask"]

    prompt = f"""Startup idea: {idea}
Industry: {industry}
Stage: {stage}
Number of slides: {slide_count}

Generate a complete investor-ready pitch deck.
Include ONLY these slide IDs in this exact order: {', '.join(selected)}"""

    resp = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {"role": "system", "content": SYSTEM},
            {"role": "user", "content": prompt}
        ],
        temperature=0.8,
        max_tokens=4000,
    )

    raw = resp.choices[0].message.content.strip()
    # Strip markdown fences if present
    if raw.startswith("```"):
        raw = raw.split("```")[1]
        if raw.startswith("json"):
            raw = raw[4:]
    return json.loads(raw.strip())

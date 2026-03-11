from fastapi import APIRouter, HTTPException
from fastapi.responses import Response
from pydantic import BaseModel
from app.services.generator import generate_pitch
from app.services.exporter import build_pptx, build_pdf, THEMES

router = APIRouter()

class PitchRequest(BaseModel):
    idea: str
    industry: str = "Technology"
    stage: str = "Seed"
    slide_count: int = 10

class ExportRequest(BaseModel):
    pitch: dict
    theme: str = "midnight"
    format: str = "pptx"

@router.post("/generate")
def generate(req: PitchRequest):
    try:
        data = generate_pitch(req.idea, req.industry, req.stage, req.slide_count)
        return data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/export")
def export_deck(req: ExportRequest):
    try:
        if req.format == "pdf":
            file_bytes = build_pdf(req.pitch, req.theme)
            return Response(
                content=file_bytes,
                media_type="application/pdf",
                headers={"Content-Disposition": "attachment; filename=pitchdeck.pdf"}
            )
        else:
            file_bytes = build_pptx(req.pitch, req.theme)
            return Response(
                content=file_bytes,
                media_type="application/vnd.openxmlformats-officedocument.presentationml.presentation",
                headers={"Content-Disposition": "attachment; filename=pitchdeck.pptx"}
            )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/themes")
def get_themes():
    return [{"key": k, "name": v["name"], "colors": {
        "accent": "#" + v["accent"],
        "bg_dark": "#" + v["bg_dark"],
        "bg_light": "#" + v["bg_light"]
    }} for k, v in THEMES.items()]

@router.get("/health")
def health():
    return {"status": "ok"}

import subprocess, json, os, tempfile
from fastapi import APIRouter, HTTPException
from fastapi.responses import FileResponse
from pydantic import BaseModel
from typing import Any

router = APIRouter()

class ExportRequest(BaseModel):
    pitch: Any
    theme: str = "orange"
    format: str = "pptx"  # pptx or pdf handled client-side

@router.post("/export/pptx")
def export_pptx(req: ExportRequest):
    # Write pitch JSON to temp file
    tmp_json = tempfile.NamedTemporaryFile(suffix=".json", delete=False, mode='w')
    json.dump(req.pitch, tmp_json)
    tmp_json.close()

    out_path = tempfile.mktemp(suffix=".pptx")
    script = os.path.join(os.path.dirname(__file__), "..", "pptx_gen.js")
    script = os.path.abspath(script)

    try:
        result = subprocess.run(
            ["node", script, json.dumps(req.pitch), req.theme, out_path],
            capture_output=True, text=True, timeout=30
        )
        if result.returncode != 0 or not os.path.exists(out_path):
            raise Exception(result.stderr or "pptx generation failed")

        name = (req.pitch.get("startup_name") or "pitch").replace(" ", "_")
        return FileResponse(
            out_path,
            media_type="application/vnd.openxmlformats-officedocument.presentationml.presentation",
            filename=f"{name}_pitchdeck.pptx",
            headers={"Content-Disposition": f'attachment; filename="{name}_pitchdeck.pptx"'}
        )
    except Exception as e:
        raise HTTPException(500, str(e))
    finally:
        os.unlink(tmp_json.name)

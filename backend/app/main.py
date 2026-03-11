from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import pitch, export
from app.core.config import settings

app = FastAPI(title="PitchDeck AI")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(pitch.router, prefix="/api")
app.include_router(export.router, prefix="/api")

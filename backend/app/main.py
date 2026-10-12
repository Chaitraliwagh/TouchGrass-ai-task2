"""FastAPI app: one endpoint that asks Gemma for an outdoor plan."""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from . import ai_service
from .config import settings
from .models import ActivityPlan, ActivityRequest

app = FastAPI(title="TouchGrass AI")

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.frontend_origins,
    allow_methods=["*"],
    allow_headers=["*"],
)


def _error(status: int, code: str, message: str) -> JSONResponse:
    return JSONResponse(status_code=status, content={"detail": {"code": code, "message": message}})


@app.get("/api/health")
async def health():
    return {"status": "ok", "model": settings.gemma_model}


@app.post("/api/generate-activity", response_model=ActivityPlan)
async def generate_activity(req: ActivityRequest):
    try:
        return await ai_service.generate_activity(req)
    except ai_service.AIUnavailableError:
        return _error(503, "OLLAMA_DOWN",
                      "Gemma is not available. Please make sure Ollama is running and the Gemma model is installed.")
    except ai_service.ModelMissingError:
        return _error(503, "MODEL_MISSING",
                      f"The Gemma model is not installed. Run: ollama pull {settings.gemma_model}")
    except ai_service.AIResponseError:
        return _error(502, "BAD_AI_RESPONSE",
                      "Gemma gave an answer we could not read. Please try again.")

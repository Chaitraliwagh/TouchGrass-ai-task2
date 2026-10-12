"""Settings read from environment variables (or a local .env file)."""
import os
from dotenv import load_dotenv

load_dotenv()


class Settings:
    ollama_base_url: str = os.getenv("OLLAMA_BASE_URL", "http://localhost:11434").rstrip("/")
    gemma_model: str = os.getenv("GEMMA_MODEL", "gemma3:4b")
    timeout: float = float(os.getenv("REQUEST_TIMEOUT_SECONDS", "120"))
    frontend_origins: list[str] = [
        o.strip()
        for o in os.getenv("FRONTEND_ORIGINS", "http://localhost:5173,http://127.0.0.1:5173").split(",")
        if o.strip()
    ]


settings = Settings()

"""Talks to Gemma (through Ollama) and turns its reply into a validated plan."""
import json
import re

import httpx
from pydantic import ValidationError

from .config import settings
from .models import ActivityPlan, ActivityRequest
from .prompts import SYSTEM_PROMPT, build_user_prompt

DEFAULT_SAFETY = (
    "Stay in safe, public or familiar areas, check the weather, follow local rules, "
    "avoid restricted areas, and tell someone where you are going."
)
DEFAULT_SCREEN_OFF = "Keep your phone in your bag or pocket for the whole activity."


class AIUnavailableError(Exception):
    """Ollama is not reachable."""


class ModelMissingError(Exception):
    """Ollama is running but the Gemma model is not downloaded."""


class AIResponseError(Exception):
    """Gemma replied, but we could not turn it into a valid plan."""


async def call_ollama(messages: list[dict]) -> str:
    """Send a chat request to Ollama and return the raw text from Gemma."""
    payload = {
        "model": settings.gemma_model,
        "messages": messages,
        "stream": False,
        "format": "json",
        "options": {"temperature": 0.9},
    }
    try:
        async with httpx.AsyncClient(timeout=settings.timeout) as client:
            resp = await client.post(f"{settings.ollama_base_url}/api/chat", json=payload)
    except (httpx.ConnectError, httpx.ConnectTimeout):
        raise AIUnavailableError()
    except httpx.TimeoutException:
        raise AIResponseError("Gemma took too long to answer.")
    if resp.status_code == 404:
        raise ModelMissingError()
    if resp.status_code != 200:
        raise AIResponseError(f"Ollama returned status {resp.status_code}.")
    try:
        return resp.json()["message"]["content"]
    except (KeyError, ValueError):
        raise AIResponseError("Unexpected reply from Ollama.")


def _as_list(value) -> list[str]:
    if isinstance(value, str):
        parts = re.split(r"\n|;|,(?=\s)", value)
        return [re.sub(r"^\s*(\d+[.)]|[-*•])\s*", "", p).strip() for p in parts if p.strip()]
    if isinstance(value, list):
        return [str(v).strip() for v in value if str(v).strip()]
    return []


def parse_plan(raw: str, req: ActivityRequest) -> ActivityPlan:
    """Extract JSON from Gemma's text, clean it up and validate it."""
    text = raw.strip()
    text = re.sub(r"^```(?:json)?|```$", "", text, flags=re.MULTILINE).strip()
    start, end = text.find("{"), text.rfind("}")
    if start == -1 or end <= start:
        raise AIResponseError("No JSON found in Gemma's reply.")
    try:
        data = json.loads(text[start : end + 1])
    except json.JSONDecodeError:
        raise AIResponseError("Gemma's reply was not valid JSON.")
    if not isinstance(data, dict):
        raise AIResponseError("Gemma's reply was not a JSON object.")

    data["steps"] = _as_list(data.get("steps"))
    data["what_to_carry"] = _as_list(data.get("what_to_carry"))
    data["company"] = req.company
    data["difficulty"] = str(data.get("difficulty") or req.difficulty)
    data["duration"] = str(data.get("duration") or req.time)
    data["safety"] = str(data.get("safety") or DEFAULT_SAFETY)
    data["screen_off_goal"] = str(data.get("screen_off_goal") or DEFAULT_SCREEN_OFF)
    try:
        plan = ActivityPlan(**data)
    except (ValidationError, TypeError):
        raise AIResponseError("Gemma's reply was missing required fields.")
    if not plan.activity_name.strip() or not plan.steps or not plan.offline_challenge.strip():
        raise AIResponseError("Gemma's plan was incomplete.")
    return plan


async def generate_activity(req: ActivityRequest) -> ActivityPlan:
    """Ask Gemma for a plan. Retries once if the reply is malformed."""
    messages = [
        {"role": "system", "content": SYSTEM_PROMPT},
        {"role": "user", "content": build_user_prompt(req)},
    ]
    last_error = AIResponseError("Unknown error.")
    for _ in range(2):
        raw = await call_ollama(messages)
        try:
            return parse_plan(raw, req)
        except AIResponseError as err:
            last_error = err
    raise last_error

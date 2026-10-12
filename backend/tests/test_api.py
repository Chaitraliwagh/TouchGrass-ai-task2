import asyncio
import json

import pytest
from fastapi.testclient import TestClient

from app import ai_service
from app.main import app
from app.models import ActivityRequest

client = TestClient(app)

VALID = {"time": "1 hour", "difficulty": "Easy", "company": "Alone",
         "mood": "Relaxing", "interest": "Nature", "environment": "Park"}

GOOD_REPLY = json.dumps({
    "activity_name": "Sunset Observation Walk", "description": "A slow walk.",
    "duration": "45 minutes", "difficulty": "Easy", "why": "Relaxing and short.",
    "what_to_carry": ["Water", "Comfortable shoes"],
    "steps": ["Walk to a safe park.", "Notice 3 sounds."],
    "offline_challenge": "Notice 5 things you usually ignore.",
    "screen_off_goal": "Do not check your phone.", "safety": "Stay in public areas.",
})


def fake_ollama(reply):
    async def _fake(messages):
        return reply
    return _fake


def test_generate_activity_ok(monkeypatch):
    monkeypatch.setattr(ai_service, "call_ollama", fake_ollama(GOOD_REPLY))
    r = client.post("/api/generate-activity", json=VALID)
    assert r.status_code == 200
    body = r.json()
    assert body["activity_name"] == "Sunset Observation Walk"
    assert body["company"] == "Alone"
    assert len(body["steps"]) == 2


def test_invalid_request_rejected():
    r = client.post("/api/generate-activity", json={**VALID, "time": "forever"})
    assert r.status_code == 422


def test_empty_request_rejected():
    assert client.post("/api/generate-activity", json={}).status_code == 422


def test_parse_handles_markdown_fences_and_string_steps():
    raw = "```json\n" + json.dumps({
        "activity_name": "Leaf Hunt", "duration": "30 minutes",
        "steps": "1. Go outside\n2. Find leaves", "what_to_carry": "Water, Notebook",
        "offline_challenge": "Find 3 leaf shapes."}) + "\n```"
    plan = ai_service.parse_plan(raw, ActivityRequest(**VALID))
    assert plan.steps == ["Go outside", "Find leaves"]
    assert plan.what_to_carry == ["Water", "Notebook"]
    assert plan.safety  # default filled in
    assert plan.screen_off_goal


def test_parse_rejects_garbage():
    with pytest.raises(ai_service.AIResponseError):
        ai_service.parse_plan("sorry, I cannot help", ActivityRequest(**VALID))


def test_parse_rejects_missing_steps():
    with pytest.raises(ai_service.AIResponseError):
        ai_service.parse_plan(json.dumps({"activity_name": "X", "offline_challenge": "Y"}),
                              ActivityRequest(**VALID))


def test_bad_ai_response_returns_502(monkeypatch):
    monkeypatch.setattr(ai_service, "call_ollama", fake_ollama("not json"))
    r = client.post("/api/generate-activity", json=VALID)
    assert r.status_code == 502
    assert r.json()["detail"]["code"] == "BAD_AI_RESPONSE"


def test_retry_recovers_after_bad_first_reply(monkeypatch):
    replies = iter(["oops", GOOD_REPLY])

    async def _fake(messages):
        return next(replies)
    monkeypatch.setattr(ai_service, "call_ollama", _fake)
    plan = asyncio.run(ai_service.generate_activity(ActivityRequest(**VALID)))
    assert plan.activity_name == "Sunset Observation Walk"


def test_ollama_down_returns_503(monkeypatch):
    async def _down(messages):
        raise ai_service.AIUnavailableError()
    monkeypatch.setattr(ai_service, "call_ollama", _down)
    r = client.post("/api/generate-activity", json=VALID)
    assert r.status_code == 503
    assert r.json()["detail"]["code"] == "OLLAMA_DOWN"


def test_model_missing_returns_503(monkeypatch):
    async def _missing(messages):
        raise ai_service.ModelMissingError()
    monkeypatch.setattr(ai_service, "call_ollama", _missing)
    r = client.post("/api/generate-activity", json=VALID)
    assert r.json()["detail"]["code"] == "MODEL_MISSING"

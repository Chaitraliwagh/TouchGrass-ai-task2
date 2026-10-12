# TouchGrass AI 🌱

> Let AI plan it. You go live it.

## What is it?

TouchGrass AI is a small web app that plans a simple, safe outdoor activity for you. You pick your free time, difficulty, company, mood and interest. **Google Gemma**, running locally through **Ollama**, writes a personalised plan with a **Screen-Off Challenge**. Then the app tells you to close the screen and go outside.

## Why I Built It

This project is my entry for the **Hacktoberfest Open-Source AI Challenge: Week 1 — Touch Grass**. Most AI apps try to keep you on a screen. This one does the opposite: the AI is only used to *plan*, the digital part is short, and the final screen says "Now close this screen."

## How It Works

```
User preferences
      ↓
FastAPI (/api/generate-activity)
      ↓
Gemma (via Ollama, local)
      ↓
Outdoor activity plan (JSON, validated)
      ↓
Save / print / copy plan
      ↓
Close screen
      ↓
Go outside
```

## Features

- Landing page and a simple 5-question planner form (plus optional place)
- Real Gemma generation through Ollama: no dummy responses
- Structured JSON output, validated with Pydantic, with one automatic retry and safe defaults if Gemma leaves out the safety note or screen-off goal
- Outdoor Activity Card: duration, difficulty, company, why it suits you, what to carry, steps, safety
- **Screen-Off Challenge** and screen-off goal in every plan
- "I'm Going Outside 🌱" mode with a short checklist and no feed
- Print (print-friendly CSS), download as `.txt`, copy to clipboard
- "Try Another Plan" and "Surprise Me 🌿" (random preferences sent to Gemma)
- Friendly errors: backend down, Ollama down, model missing, bad AI reply, empty form
- No database, no accounts

## Tech Stack

- Frontend: React + Vite + Tailwind CSS
- Backend: FastAPI + Python
- AI: Google Gemma through Ollama

## Why Gemma?

Gemma is an open-weight model, so it can run on your own computer. That means no paid API, no API keys, and your preferences never leave your machine. It is also small enough (the 4B version) to run on an ordinary laptop.

## Installation

You need: [Node.js](https://nodejs.org) 18+, Python 3.10+, and [Ollama](https://ollama.com/download).

### 1. Ollama + Gemma

```bash
# after installing Ollama from https://ollama.com/download
ollama pull gemma3:4b
ollama run gemma3:4b "Say hi"    # quick check, type /bye to exit
```

Ollama normally runs in the background after install. If not, start it with `ollama serve`.
`gemma3:4b` is the default. Check https://ollama.com/library for newer Gemma versions; to use another one, change `GEMMA_MODEL` in `backend/.env`.

### 2. Backend

```bash
cd backend
python -m venv .venv
# Windows: .venv\Scripts\activate     Mac/Linux: source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env                  # Windows: copy .env.example .env
```

### 3. Frontend

```bash
cd frontend
npm install
cp .env.example .env                  # Windows: copy .env.example .env
```

## Running Locally

Use three terminals.

```bash
# Terminal 1: Ollama (skip if it is already running)
ollama serve

# Terminal 2: backend
cd backend
uvicorn app.main:app --reload --port 8000

# Terminal 3: frontend
cd frontend
npm run dev
```

Open http://localhost:5173. The first plan can be slow while Gemma loads into memory.

## API

`POST /api/generate-activity`

```json
{
  "time": "1 hour",
  "difficulty": "Easy",
  "company": "Alone",
  "mood": "Relaxing",
  "interest": "Nature",
  "environment": "Park"
}
```

Allowed values: time (`15 minutes`, `30 minutes`, `1 hour`, `2 hours`, `Half day`), difficulty (`Easy`, `Moderate`, `Challenging`), company (`Alone`, `With Friends`, `With Family`, `With Partner`), mood (`Relaxing`, `Adventurous`, `Social`, `Active`, `Creative`, `Curious`), interest (`Nature`, `Walking`, `Photography`, `Fitness`, `Observation`, `Exploring`, `Games`). `environment` is optional.

Response:

```json
{
  "activity_name": "...", "description": "...", "duration": "...", "difficulty": "...",
  "company": "...", "why": "...", "what_to_carry": [], "steps": [],
  "offline_challenge": "...", "screen_off_goal": "...", "safety": "..."
}
```

Errors return `{"detail": {"code": "...", "message": "..."}}` with codes `OLLAMA_DOWN` (503), `MODEL_MISSING` (503), `BAD_AI_RESPONSE` (502). Invalid input returns 422. `GET /api/health` shows the configured model.

## Project Structure

```
touchgrass-ai/
├── backend/
│   ├── app/ (main.py, models.py, ai_service.py, prompts.py, config.py)
│   ├── tests/test_api.py
│   ├── requirements.txt
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── components/ (LandingPage, PlannerForm, ActivityCard, GoingOutside, LoadingState)
│   │   ├── services/ (api.js, plan.js, plan.test.js)
│   │   ├── App.jsx, main.jsx, index.css
│   └── package.json, vite.config.js, tailwind.config.js
├── docs/ (DEV_SUBMISSION.md, COMMIT_PLAN.md)
├── .gitignore
└── README.md
```

## Screenshots

- [Landing page screenshot]
- [Planner form screenshot]
- [Activity card screenshot]
- [Going Outside screen screenshot]

## Testing

Automated:

```bash
cd backend && python -m pytest        # API, validation, parsing/fallback tests (no Ollama needed)
cd frontend && npm test               # plan-to-text formatting test
```

Manual checklist:

- [ ] Ollama running and `gemma3:4b` pulled
- [ ] Backend starts, http://localhost:8000/api/health returns ok
- [ ] Submitting the form with a missing choice shows a message
- [ ] A valid form shows a loading screen, then an activity card
- [ ] Card shows Screen-Off Challenge and safety reminder
- [ ] Copy, Download and Print work
- [ ] "Try Another Plan" gives a new plan
- [ ] "Surprise Me" works
- [ ] "I'm Going Outside" shows the checklist
- [ ] Stop Ollama: a friendly "Gemma is not available" message appears
- [ ] Stop the backend: a friendly "can't reach backend" message appears
- [ ] Layout works on a phone-width window

## Future Improvements

- Weather-aware suggestions
- Save plan as a PDF
- Multiple languages
- Streaming the plan as Gemma writes it
- Optional Docker setup

## Open Innovation

Open-weight AI made this possible without a paid API or a cloud account. Anyone can download Gemma, run it offline, read how the prompt works in `backend/app/prompts.py`, and swap in a different Gemma size. Local inference also keeps the user's preferences private.

## Challenge

Created for the Hacktoberfest Open-Source AI Challenge: Week 1 — Touch Grass.

AI can help you plan. The best part is the part where you close the laptop.

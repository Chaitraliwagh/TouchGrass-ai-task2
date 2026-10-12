# Draft — edit before publishing

Tags: #devchallenge #hf26challenge

## What I Built

TouchGrass AI is an AI outdoor activity planner. You choose your free time, difficulty, company, mood and interest. Gemma writes a short outdoor plan with a Screen-Off Challenge, a "what to carry" list and a safety reminder. The app then lets you print, download or copy the plan, and its "I'm Going Outside" screen tells you to close the screen. The AI plans; you go live it.

## Demo

- Live demo: [Live Demo URL]
- Video: [Demo Video URL]

## Code

[GitHub Repository URL]

## How I Built It

- Frontend: React, Vite, Tailwind CSS
- Backend: FastAPI (Python) with Pydantic models
- AI: Google Gemma (`gemma3:4b`) running locally through Ollama

The backend turns the user's choices into a prompt and sends it to Gemma through Ollama's `/api/chat` endpoint with JSON output enabled. The prompt tells Gemma to return one specific JSON structure, to include a Screen-Off Challenge, and to stay with safe, low-risk activities. The backend then extracts and validates the JSON with Pydantic, retries once if the reply is malformed, and fills in default safety and screen-off text if Gemma leaves them out. If Ollama or the model is missing, the user sees a plain-language message. There is no database and no accounts.

## Why Does Open Innovation Matter?

Because Gemma is open-weight, the whole app runs on a normal laptop with no paid API and no keys. The user's preferences stay on their own machine, and anyone can inspect the prompt, change the model size, or run it offline. That fits a project whose goal is to reduce screen time.

## My Agent Session

[Add your agent session link here, or remove this section if you did not use one]

## Prize Categories

- Best Use of Gemma — Gemma is the core engine of the app, running locally through Ollama.
- Only add other categories if you actually used that partner's technology. This project does not use any other partner tools.

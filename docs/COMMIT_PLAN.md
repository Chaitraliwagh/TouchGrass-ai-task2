# Suggested commits

1. `Initial project setup` — .gitignore, folder structure
2. `Add FastAPI backend` — config, models, main
3. `Add Gemma integration` — prompts, ai_service (Ollama)
4. `Add planner UI` — landing page, form, api service
5. `Add activity card` — card, print/download/copy
6. `Add screen-off mode` — GoingOutside, Surprise Me
7. `Add tests, README and submission draft`

## Push to GitHub

```bash
cd touchgrass-ai
git init
git add .
git status        # confirm .env and node_modules are NOT listed
git commit -m "Initial commit: TouchGrass AI"
git branch -M main
git remote add origin https://github.com/<your-username>/touchgrass-ai.git
git push -u origin main
```

# Scholaris — Intelligent Autonomous Literature & Fact Engine

> An autonomous agentic research engine with a scholarly, Dark Academia aesthetic. Scholaris takes any complex inquiry, decomposes it into structured sub-questions, autonomously routes retrieval across web and academic sources, critiques evidence, and synthesizes a fully cited academic report.

---

## 🏛️ Architecture & Concept

Scholaris follows **Clean Architecture** principles to separate core research reasoning from external drivers and presentation:

- **Frontend (`frontend/`)**: React 19 + TypeScript + Vite + Tailwind CSS v4. Features a **Dark Academia** scholarly interface:
  - Deep obsidian and warm amber/gold color palette with serif typography (*Playfair Display*, *EB Garamond*).
  - Ambient particle dust and soft candlelight glows.
  - Interactive **5-stage Research Pipeline Tracker** (Decomposing → Routing → Gathering Evidence → Fact-Checking → Synthesizing).
  - Scholarly **Report Viewer** with markdown rendering, inline citations, key takeaway badges, and citation sources.
  - Built-in **Scholar Session & Auth Modal** with instant guest access or credentials sign-in.
- **Backend (`backend/`)**: FastAPI application executing an autonomous multi-stage research graph:
  - **Planner**: Decomposes inquiries into targeted sub-questions.
  - **Router**: Dispatches sub-questions to specialized tools (Tavily, Semantic Scholar, NewsAPI, iFixit).
  - **Retriever**: Queries upstream APIs and aggregates raw evidence.
  - **Critic**: Analyzes relevance and sufficiency of evidence; triggers retrieval loops if gaps remain.
  - **Synthesizer**: Writes an academic-grade report with structured citations.

---

## 🔑 Environment Variables & Where to Get Them

Scholaris requires a few API keys to power its research intelligence. Create your `.env` files using the provided templates:

### Backend `.env` (`backend/.env`)

Copy `backend/.env.example` to `backend/.env`:
```bash
cp backend/.env.example backend/.env
```

| Variable | Required | Description | Where to Get It |
|---|---|---|---|
| `OPENAI_API_KEY` | **Yes** | API key for structured LLM generation (OpenAI or OpenAI-compatible) | [OpenAI Platform](https://platform.openai.com/api-keys) or [OpenRouter](https://openrouter.ai/keys) |
| `OPENAI_MODEL_PLANNER` | **Yes** | Model identifier (e.g. `gpt-4o-mini`, `gpt-4o`, `deepseek-chat`) | Chosen model from your provider |
| `OPENAI_BASE_URL` | *Optional* | Base URL for LLM provider (default: `https://api.openai.com/v1`) | Provider docs (e.g. `https://openrouter.ai/api/v1` or local Ollama) |
| `TAVILY_API_KEY` | **Yes** | API key for web search and fact retrieval | [Tavily AI Search](https://app.tavily.com/home) (Free tier available) |
| `NEWS_API_KEY` | **Yes** | API key for current events and news search | [NewsAPI.org](https://newsapi.org/register) (Free tier available) |
| `SEMANTIC_SCHOLAR_API_KEY` | *Optional* | API key for academic papers and citation graph | [Semantic Scholar API](https://www.semanticscholar.org/product/api) (Works unauthenticated with rate limits) |
| `DATABASE_URL` | **Yes** | PostgreSQL connection URL | Local PostgreSQL or free cloud instance on [Neon](https://neon.tech) / [Supabase](https://supabase.com) |
| `JWT_SECRET_KEY` | **Yes** | Secret string for signing scholar authentication tokens | Generate via: `python -c "import secrets; print(secrets.token_hex(32))"` |
| `ALLOWED_ORIGINS` | *Optional* | Comma-separated list of CORS origins (default includes localhost 3000 & 5173) | N/A |
| `REQUEST_TIMEOUT_SECONDS` | *Optional* | Timeout for outbound requests in seconds (recommended: `120`) | N/A |
| `MAX_SUBQUESTIONS` | *Optional* | Max sub-questions planned per topic (default: `5`) | N/A |
| `MAX_RETRIEVAL_LOOPS` | *Optional* | Max loops the Critic can trigger for missing evidence (default: `3`) | N/A |

### Frontend `.env` (`frontend/.env`)

Copy `frontend/.env.example` to `frontend/.env`:
```bash
cp frontend/.env.example frontend/.env
```

| Variable | Required | Description | Default |
|---|---|---|---|
| `VITE_API_URL` | *Optional* | URL of the backend API service | `http://127.0.0.1:8000` (or `/api` proxy) |

---

## 🚀 Quick Start Guide

### 1. Start the Backend

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Activate your virtual environment and install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Ensure `backend/.env` is configured with your API keys.
4. Launch the FastAPI server:
   ```bash
   fastapi dev infrastructure/api/main.py
   ```
   *The backend will be running at `http://127.0.0.1:8000`.*

### 2. Start the Frontend

1. In a separate terminal, navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies (if not already installed):
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
   *The frontend will open at `http://localhost:3000`.*

---

## 🔍 Using Scholaris

1. Open `http://localhost:3000` in your browser.
2. Enter any research topic or question into the search bar (e.g., *"How do next-generation perovskite solar cells compare to traditional silicon in commercial longevity?"* or *"Analyze recent developments in quantum error correction"*).
3. Click **Begin Research**.
4. Watch the 5-stage tracker unfold in real time.
5. Review the generated scholarly report, complete with key findings, synthesized sections, and verifiable source citations!

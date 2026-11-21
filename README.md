![Quelm Banner](./preview.png)

# Quelm

> **Framework-Independent AI Agent Benchmarking, Chaos-Testing & Execution Platform**  
> *Built for Global AI Hackathon — Problem Statement 02: "Build a Benchmarking Platform for AI Agents, Not Just Models"*

[![GitHub Repository](https://img.shields.io/badge/GitHub-Ankit--cs%2Fmelq-111111?style=flat&logo=github)](https://github.com/Ankit-cs/melq)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-16%20(React%2019)-black?style=flat&logo=next.js)](https://nextjs.org/)
[![Express](https://img.shields.io/badge/Express-Backend%20API-grey?style=flat&logo=express)](https://expressjs.com/)
[![Gemini](https://img.shields.io/badge/Gemini-2.0%20Flash-orange?style=flat&logo=google)](https://deepmind.google/technologies/gemini/)
[![Prisma](https://img.shields.io/badge/Prisma-PostgreSQL-teal?style=flat&logo=prisma)](https://www.prisma.io/)
[![Redis](https://img.shields.io/badge/Redis-BullMQ%20Queue-red?style=flat&logo=redis)](https://redis.io/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38bdf8?style=flat&logo=tailwindcss)](https://tailwindcss.com/)

---

## Table of Contents

- [Overview & The Problem](#overview--the-problem)
- [Key Features](#key-features)
- [System Architecture](#system-architecture)
- [Framework-Independent Benchmarking](#framework-independent-benchmarking)
- [Chaos Injection & Failure Testing](#chaos-injection--failure-testing)
- [Repeatability & Statistical Evaluation](#repeatability--statistical-evaluation)
- [Inspection & Comparison Interface](#inspection--comparison-interface)
- [Global Agent Leaderboard](#global-agent-leaderboard)
- [Visual Workflow Builder](#visual-workflow-builder)
- [Tech Stack](#tech-stack)
- [Repository Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Docker Setup](#docker-setup)
  - [Database Migration](#database-migration)
  - [Running Locally](#running-locally)
- [API Reference](#api-reference)
- [Design System & Palette](#design-system--palette)

---

## Overview & The Problem

Traditional AI benchmarks (MMLU, HumanEval, GSM8K) measure raw model intelligence, but they **fail to evaluate how an autonomous AI agent performs in production**.

Two agents utilizing the exact same underlying LLM (e.g. Gemini 2.0 Flash or GPT-4o) produce drastically different real-world results:
- One agent may complete a complex multi-step task in **3 tool calls, 400 tokens, and 2 seconds**.
- Another agent using the same model may burn **8,000 tokens in an infinite loop, hallucinate fake citations, and crash when an external tool returns an HTTP 500 error**.

**Quelm is a framework-independent benchmarking and chaos-testing platform** that evaluates entire AI agents across identical standardized tasks under normal and simulated failure conditions.

---

## Key Features

- **Framework Independence** — Benchmark agents written in LangChain, CrewAI, AutoGen, LlamaIndex, or raw HTTP webhooks without rewriting them.
- **Repeatable Multi-Run Evaluations** — Execute tasks across 1x to 5x iterations to detect stochastic variance, non-deterministic traps, and true reliability.
- **Controlled Chaos Engine** — Inject tool failures (HTTP 500), rate limit throttling (HTTP 429), and misleading contextual instructions to measure resilience.
- **Comprehensive Scorecard** — Track Task Success Rate, Execution Steps, Tool Invocations, Token Usage, Cost ($ USD), Latency, and Resilience Score.
- **LLM-as-a-Judge Evaluation** — Automated multi-dimensional scoring powered by Gemini 2.0 Flash with factual checks, penalty audits, and qualitative critiques.
- **Head-to-Head Comparison Matrix** — Compare 2 to 5 agents side-by-side with granular execution trace diff timelines.
- **Global Agent Leaderboard** — Ranked standings featuring Gold, Silver, and Bronze medals, resilience scores, average latency, and cost per task.
- **Distributed Multi-Agent Workflows** — Visual React Flow canvas to compose, test, and monitor distributed agent graphs with BullMQ and Server-Sent Events.

---

## System Architecture

```mermaid
flowchart TB
    subgraph Client["Next.js 16 Frontend (Warm Editorial Design)"]
        BA["Benchmark Arena\n/benchmark"]
        CD["Trace Diff & Matrix\n/benchmark/:id"]
        LB["Agent Leaderboard\n/leaderboard"]
        WB["Workflow Builder\n/builder/:id"]
    end

    subgraph API["Express REST API (Port 8000)"]
        BR["/api/benchmark/*"]
        WF["/api/workflows"]
        RN["/api/runs"]
    end

    subgraph BenchmarkSystem["Benchmark Engine"]
        Runner["Benchmark Runner\n(1x-5x Repeated Runs)"]
        Chaos["Chaos Injection Engine\n500s · 429s · Misleading Context"]
        MockTools["Deterministic Sandboxed Tools\nSearch · DB · Math · API"]
        Judge["Automated Evaluator\nRule Checks + LLM-as-a-Judge"]
    end

    subgraph AgentRuntime["Framework-Independent Agent Abstraction"]
        ReactAgent["Resilient ReAct Agent\n(Gemini 2.0 Flash)"]
        NaiveAgent["Naive Baseline Agent\n(Direct LLM)"]
        PipeAgent["Decomposed Pipeline Agent\n(Planner + Executor)"]
        WebhookAgent["External Webhook Agent\n(LangChain / CrewAI / AutoGen)"]
    end

    subgraph Data["Persistence & Queues"]
        PG[("PostgreSQL 16\nBenchmark & Execution Traces")]
        RD[("Redis 7\nBullMQ Queues")]
    end

    Client --> API
    API --> BenchmarkSystem
    BenchmarkSystem --> AgentRuntime
    BenchmarkSystem --> Chaos
    BenchmarkSystem --> MockTools
    BenchmarkSystem --> Judge
    API --> Data
```

---

## Framework-Independent Benchmarking

Quelm supports any agent framework out of the box through a standardized JSON execution protocol:

### Reference In-Memory Agents:
1. **Resilient ReAct Agent (`ResilientReactAgent`)**:
   Hardened Gemini 2.0 Flash agent with exponential backoff, error retries, tool fallbacks, and adversarial trap resistance.
2. **Naive Direct Agent (`NaiveDirectAgent`)**:
   Standard unhardened baseline agent that crashes or hallucinates under chaos.
3. **Decomposed Pipeline Agent (`DecomposedPipelineAgent`)**:
   Three-stage planner, executor, and synthesizer.

### External Agents (LangChain, CrewAI, AutoGen, Custom):
Register any external agent webhook in the Leaderboard. Quelm dispatches the standardized payload:

```json
POST /your-agent-endpoint
Content-Type: application/json

{
  "taskId": "task_research_01",
  "taskTitle": "Comparative Market Analysis",
  "prompt": "Analyze the top 3 AI agent frameworks in 2026...",
  "availableTools": ["web_search", "database_lookup", "calculator"]
}
```

Your agent simply returns its execution summary:
```json
{
  "finalAnswer": "Based on 2026 data...",
  "totalTokens": 1250,
  "promptTokens": 950,
  "completionTokens": 300,
  "stepsCount": 4,
  "toolCallsCount": 2,
  "chaosHandled": true
}
```

---

## Chaos Injection & Failure Testing

Agents in production encounter unexpected failures. Quelm includes a native **Chaos Engine** to stress-test agent behavior:

| Chaos Scenario | Simulated Event | Expected Resilient Behavior |
|---|---|---|
| **`TOOL_ERROR_500`** | Mock tool throws internal server error | Agent catches error, applies backoff, falls back to alternate tool, or reports degraded state without hallucinating. |
| **`RATE_LIMIT_429`** | LLM inference returns quota exhausted | Agent catches 429, waits for the retry window, and recovers cleanly. |
| **`MISLEADING_CONTEXT`** | Injects false premises and contradictory advice | Agent validates premise against factual tools and rejects false guidance. |

---

## Repeatability & Statistical Evaluation

Single-run evaluations are unreliable because LLM temperature introduces randomness.

Quelm executes benchmarks across **1x to 5x iterations**:
- **Success Rate (`%`)**: Percentage of iterations where the task succeeded.
- **Resilience Score (`%`)**: Ratio of injected chaos scenarios recovered from cleanly.
- **Mean Score (`0-100`)**: Combined score across factual completeness, efficiency, and LLM Judge evaluation.
- **Latency & Variance**: Mean wall-clock time and standard deviation across runs.
- **Cost & Token Consumption**: Prompt and completion token tracking with per-dollar costing ($ USD).

---

## Inspection & Comparison Interface

The `/benchmark/[id]` comparison view allows developers to diff agent runs side-by-side:
- **Head-to-Head Cards** comparing score, tokens, cost, and resilience.
- **Qualitative Critique Panel** showing LLM-as-a-judge feedback and penalty justifications.
- **Execution Trace Diff Timeline** showing the chronological step-by-step breakdown:
  - `THOUGHT`: Agent's inner reasoning chain
  - `TOOL_CALL`: Tool parameters and execution duration
  - `TOOL_RESULT`: Data returned from tools
  - `CHAOS_INJECTED`: **Highlighted in red**, displaying exact injected failures
  - `FINAL_ANSWER`: Final output delivered

---

## Pre-Configured Benchmark Suites

1. **Deep Research & Multi-Hop Reasoning**
   - Comparative analysis of AI agent frameworks in 2026
   - Multi-hop financial audit & transaction reconciliation
2. **Autonomous Customer Operations**
   - High-value refund dispute resolution
   - SLA breach diagnostic investigation
3. **Coding & Bug Fixing**
   - Concurrency deadlock resolution in Node.js worker pools
   - PostgreSQL query optimization for high-throughput tables

---

## Tech Stack

| Layer | Technologies |
|---|---|
| **Frontend** | Next.js 16 (App Router), React 19, Tailwind CSS v4, Lucide React, Canvas Confetti |
| **Backend API** | Node.js, Express, TypeScript, Zod |
| **LLM Inference & Judge** | Google Gemini 2.0 Flash (`@google/genai`) |
| **Database & ORM** | PostgreSQL 16, Prisma ORM 6.2 |
| **Caching & Queues** | Redis 7, BullMQ |
| **Testing** | Vitest, Supertest, React Testing Library |

---

## Project Structure

```text
quelm/
├── client/                     # Next.js 16 Web Application
│   ├── app/
│   │   ├── (dashboard)/
│   │   │   ├── benchmark/      # Benchmark Suite Dashboard & Runner
│   │   │   │   └── [id]/       # Head-to-Head Comparison & Trace Diff
│   │   │   ├── leaderboard/    # Global Agent Leaderboard
│   │   │   ├── workflows/      # Multi-Agent Workflow Management
│   │   │   └── runs/[id]/      # Live Run SSE Monitor
│   │   ├── (builder)/[id]/     # React Flow Canvas Builder
│   │   └── page.tsx            # Warm Editorial Landing Page
│   └── components/landing/     # Hero, Features, Architecture, Navbar
│
├── server/                     # Express REST API & Engine
│   ├── api/
│   │   └── benchmark/          # Benchmark REST Controller & Routes
│   ├── engine/
│   │   ├── benchmark/          # Runner, Suite Seeder, Agent Interfaces
│   │   │   └── agents/         # ReAct, Naive, Pipeline, Webhook Agents
│   │   ├── chaos/              # Chaos Engine & Mock Tool Interceptors
│   │   ├── evaluator/          # Multi-Metric & LLM-as-a-Judge Scorer
│   │   └── orchestrator/       # Distributed Workflow Dependency Engine
│   ├── prisma/
│   │   └── schema.prisma       # Database Schema (Suites, Runs, Traces)
│   └── index.ts                # Express Server Bootstrapper
│
├── docker-compose.yml          # PostgreSQL 16 & Redis 7 Infrastructure
└── analyse.txt                 # Comprehensive Architecture Analysis
```

---

## Getting Started

### Prerequisites

- **Node.js** >= 20.x
- **pnpm** >= 9.x
- **Docker Desktop** (for PostgreSQL and Redis)
- **Google Gemini API Key** (`GEMINI_API_KEY`)

---

### Step 1: Clone the Repository

```bash
git clone https://github.com/Ankit-cs/melq.git
cd melq/quelm
```

---

### Step 2: Configure Environment Variables

Create `.env` inside `server/`:
```env
PORT=8000
NODE_ENV=development
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/agent_platform?schema=public"
REDIS_HOST=localhost
REDIS_PORT=6379
JWT_SECRET=super_secret_jwt_key_min_32_characters_long_quelm
GEMINI_API_KEY=your_gemini_api_key_here
CLIENT_URL=http://localhost:3000
```

Create `.env.local` inside `client/`:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

---

### Step 3: Start Infrastructure via Docker

```bash
docker-compose up -d
```
*This spins up PostgreSQL on port `5432` and Redis on port `6379`.*

---

### Step 4: Apply Database Migrations & Generate Prisma Client

```bash
cd server
pnpm prisma db push
pnpm prisma generate
```

---

### Step 5: Start the Development Servers

**Terminal 1 — Backend API:**
```bash
cd server
pnpm dev
# Running on http://localhost:8000
```

**Terminal 2 — Frontend Application:**
```bash
cd client
pnpm dev
# Running on http://localhost:3000
```

Open [http://localhost:3000/benchmark](http://localhost:3000/benchmark) in your browser!

---

## API Reference

### Benchmark Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/benchmark/suites` | List all benchmark suites and constituent tasks |
| `GET` | `/api/benchmark/agents` | List all registered built-in and external agent profiles |
| `POST` | `/api/benchmark/agents` | Register a new external agent webhook |
| `POST` | `/api/benchmark/run` | Launch a benchmark run with iterations and chaos toggles |
| `GET` | `/api/benchmark/runs` | List historical benchmark runs |
| `GET` | `/api/benchmark/runs/:id` | Get detailed comparison matrix and execution traces |
| `GET` | `/api/benchmark/leaderboard` | Get ranked agent leaderboard standings |

---

## Design System & Palette

Quelm features an editorial, typographic aesthetic:

| Role | Color | Hex |
|---|---|---|
| **Background / Canvas** | Warm Cream | `#F3EEE3` |
| **Primary Text / Accents** | Ink Black | `#111111` |
| **Interactive Primary** | Burnt Orange | `#D9541E` |
| **Card Surface** | Soft Cream | `#FAF7F2` |
| **Borders** | Muted Ink | `#111111/10` |

---

## License

MIT © [Ankit](https://github.com/Ankit-cs) — Built for the Global AI Hackathon.
# 🌍 Wandering Globe — Autonomous AI Travel Architect & Real-Time Itinerary Engine

[![React](https://img.shields.io/badge/React-19.0-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-6.0-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4.21-000000?logo=express&logoColor=white)](https://expressjs.com/)
[![Groq Cloud](https://img.shields.io/badge/Groq_LPU-Inference-F55036?logo=groq&logoColor=white)](https://groq.com/)
[![Vercel](https://img.shields.io/badge/Deployment-Vercel-black?logo=vercel&logoColor=white)](https://vercel.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

> An immersive, stateful web application that transforms free-form, natural language travel prompts into structured, multi-day itineraries with real-time currency recalculation, drag-and-drop stop management, and an enterprise-grade failure resilience pipeline.

---

### 🔗 Quick Links
- 🚀 **Live Production Application:** [https://wandering-globe.vercel.app](https://wandering-globe.vercel.app)
- 📦 **GitHub Repository:** [https://github.com/adarshhhgupta/wandering-globe](https://github.com/adarshhhgupta/wandering-globe)
- 🎥 **Video Walkthrough & Architecture Demo:** [https://youtu.be/UBTp_u8TOp4](https://youtu.be/UBTp_u8TOp4)

---

## 📖 Overview

Planning international travel is often a fragmented and frustrating experience involving scattered browser tabs, unstructured travel blogs, and complex budget spreadsheets.

**Wandering Globe** solves this by combining high-speed LLM inference with an interactive, stateful web dashboard. Rather than returning passive markdown text, the platform converts natural language prompts into a rich, structured dataset that travelers can reorder, edit, refine, and budget in real time.

```
"Plan a 4-day cultural exploration in Kyoto with traditional tea houses, scenic walks, and a $1,200 budget."
                                    │
                                    ▼
       ┌────────────────────────────────────────────────────────┐
       │             Wandering Globe Engine                     │
       │  • Groq LPU Inference (OpenAI GPT-OSS / Qwen / LLaMA)   │
       │  • Heuristic JSON Repair & Structural Validation       │
       │  • Multi-Currency Recalculation Engine                 │
       │  • Stateful Drag-and-Drop Timeline Architect           │
       └────────────────────────────────────────────────────────┘
                                    │
                                    ▼
                 [ Interactive Multi-Day Visual Dashboard ]
```

---

## ⚡ Core Features

- 🧠 **Autonomous Itinerary Generation:** Generates comprehensive day-by-day schedules with categorized stops (attractions, dining, cultural experiences, transport, leisure), optimal time slots, estimated costs, and coordinates.
- 🔄 **Conversational Refinement Loop:** Refines existing itineraries using contextual follow-up prompts (e.g., *"Make Day 2 more budget-friendly"* or *"Add an evening jazz club in Gion"*) without re-generating from scratch.
- 🖐️ **Interactive Drag-and-Drop Timeline:** Reorder activities within a day or seamlessly migrate stops across different days using HTML5 Drag-and-Drop and accessible touch-friendly controls.
- 💱 **Live Multi-Currency Financial Engine:** Real-time budget conversion across 5 global currencies (`USD $`, `EUR €`, `GBP £`, `INR ₹`, `JPY ¥`) with instant recalculation of daily and total expenses based on live FX exchange rates.
- 🛡️ **Defensive Failure-Tolerant Pipeline:** Client-side heuristic JSON repair, strict runtime schema validation, and stale-response cancellation guarantee zero app crashes from malformed LLM responses.
- 🧪 **System Reliability & Simulation Lab:** An in-app diagnostic suite to stress-test system behavior against truncated JSON, schema corruption, simulated 10s latency timeouts, 429 rate limits, and 500 server outages.
- 💾 **Local Persistence & Export:** Automatically syncs changes to `localStorage`, provides one-click JSON itinerary export, and features an immutable undo/redo history stack.
- 🎨 **Apple iOS 18 Glassmorphism Design:** Dual-transparency glass surfaces (65% containers, 25% chips), 20px blur filtration, responsive Dynamic Island header, and a 60 FPS HTML5 radar canvas background.

---

## 🏗️ Technical Architecture & Design Patterns

Wandering Globe is built with an emphasis on security, clean separation of concerns, and resilient data processing.

```
                      [ Client: React 19 Frontend ]
                      │                         ▲
   1. User Prompt     │                         │ 6. Validated State
   (Natural Language) │                         │    (Interactive UI)
                      ▼                         │
            ┌───────────────────┐    ┌───────────────────────────┐
            │ Central API Layer │    │ Defensive Client Pipeline │
            │   (src/lib/api)   │    │  • jsonRepair.js          │
            └─────────┬─────────┘    │  • validateResult.js      │
                      │              └─────────────▲─────────────┘
                      │ 2. HTTP POST               │
                      ▼                            │ 5. Normalized JSON
            ┌───────────────────┐                  │
            │ Express Proxy API │──────────────────┘
            │  (server/index)   │
            └─────────┬─────────┘
                      │ 3. API Key Isolation (Zero Browser Leak)
                      ▼
            ┌───────────────────┐
            │ Groq Cloud Engine │  4. High-Speed LPU Inference
            │ (Groq SDK / LPU)  │ ──► Structured JSON Object
            └───────────────────┘
```

### 1. API Key Isolation Pattern
Private LLM credentials are strictly contained within the Node.js / Express proxy layer (`server/index.js` and Vercel serverless handler `api/index.js`). The client application communicates strictly with backend gateway endpoints (`/api/generate-trip`, `/api/refine-trip`), ensuring zero exposure of private API secrets in browser network tabs.

### 2. Defensive Multi-Stage Data Pipeline
Large Language Models can occasionally output corrupted syntax, extra markdown backticks, or truncated payloads. Wandering Globe implements a multi-tier defense:
1. **Extraction & Codeblock Sanitization:** Strips markdown fences (````json ... ````) and isolates JSON boundaries.
2. **Heuristic Syntax Repair (`src/utils/jsonRepair.js`):** Automatically closes unclosed arrays/objects, removes trailing commas before closing braces, and fixes escaped quote anomalies caused by token cutoffs.
3. **Runtime Schema Normalization (`src/lib/validateResult.js`):** Enforces strict typing against the itinerary schema, generates missing UUIDs, assigns default categories, and programmatically computes expense totals if omitted by the model.

### 3. Concurrency Shield & Race Condition Prevention
To prevent slow network responses from overwriting newer user requests (stale overwrite hazard), the application pairs browser `AbortController` cancellation signals with sequential, monotonically increasing `requestId` references in `src/hooks/useTripPlanner.js`. Any incoming payload whose request ID does not match the active request is immediately discarded.

### 4. Dynamic Currency Conversion Engine
The application avoids static hardcoded currency signs. All monetary figures are normalized to base USD and dynamically recomputed using a centralized FX rate matrix (`1 USD = 86.50 INR`, `0.92 EUR`, `0.79 GBP`, `154.00 JPY`), updating every stop badge, day subtotal, and total budget widget instantaneously.

---

## 💻 Tech Stack & Technical Terms

| Domain | Technologies & Libraries | Key Technical Terms & Patterns |
| :--- | :--- | :--- |
| **Frontend Core** | React 19, Vite 6, JavaScript (ES2023) | Finite State Machine, Custom Hooks (`useTripPlanner`, `useLocalStorage`), Functional Programming |
| **Styling & UI** | Vanilla CSS, Lucide React, Canvas Confetti | iOS 18 Glassmorphism, HSL Design Tokens, 20px Backdrop Blur, 44px Minimum Tap Targets, 60 FPS HTML5 Canvas |
| **Backend & Proxy** | Node.js 18+, Express 4.21, Cors, Dotenv | API Gateway Pattern, Reverse Proxy, Key Isolation, Vercel Serverless Functions (`api/index.js`) |
| **AI Inference** | Groq Cloud SDK (`groq-sdk`) | Low-Latency Processing Unit (LPU), Structured JSON Mode (`json_object`), Dynamic Prompt Engineering |
| **Supported Models** | `openai/gpt-oss-120b`, `llama-3.3-70b-versatile`, `qwen/qwen3.8-27b` | Automatic Model Failover, Adaptive Retry with Exponential Backoff |
| **Data Integrity** | Custom AST & Heuristic Parsers | Syntactic JSON Repair, Structural Schema Validation, UUID Tokenization, Deep State Immutability |
| **State Management** | React State + `localStorage` | Unidirectional Data Flow, Immutable Undo Stack, Monotonic Request Sequencing |

---

## 📂 Project Structure

```
wandering-globe/
├── api/
│   └── index.js             # Vercel Serverless API entrypoint
├── server/
│   ├── generate.js          # Direct LLM invocation with strict schema constraints
│   ├── index.js             # Express API gateway (secure key isolation & simulation endpoints)
│   ├── groqService.js       # Groq Cloud SDK client & model failover handling
│   ├── validateSchema.js    # Server-side payload sanitization & normalization
│   └── mockTrips.js         # Curated realistic trip datasets for zero-config offline use
├── src/
│   ├── components/
│   │   ├── ApiKeyModal.jsx         # In-browser client API key configurator
│   │   ├── BudgetSummary.jsx       # Real-time multi-currency breakdown & FX switcher
│   │   ├── DaySection.jsx          # Day accordion container, drop target & stop creator
│   │   ├── DestinationPortal.jsx   # 3D interactive portal with coordinate tracking
│   │   ├── ErrorBanner.jsx         # Actionable error alert with diagnostic disclosures
│   │   ├── ErrorState.jsx          # Dedicated full-page failure recovery view
│   │   ├── Footer.jsx              # World time clocks, system telemetry & back-to-top
│   │   ├── Header.jsx              # Navigation bar, Dynamic Island pill & theme toggle
│   │   ├── HeroRadarCanvas.jsx     # High-performance 60 FPS celestial flight radar
│   │   ├── LoadingState.jsx        # Telemetry loading state with AbortController trigger
│   │   ├── PromptInput.jsx         # Free-form natural language query interface
│   │   ├── RefinementBar.jsx       # Follow-up conversational prompt input bar
│   │   ├── ResultView.jsx          # Main itinerary presentation coordinator
│   │   ├── SavedTripsDrawer.jsx    # Persistent itinerary storage & JSON export drawer
│   │   ├── SimulationModal.jsx     # Reliability & resilience edge-case testing lab
│   │   ├── StopCard.jsx            # Draggable activity card with edit & delete controls
│   │   ├── TripInput.jsx           # Prompt input with vibe chips & duration selectors
│   │   └── TripView.jsx            # Action toolbar, print triggers & grid coordinator
│   ├── hooks/
│   │   ├── useTripPlanner.js       # Core state machine, AbortController & CRUD operations
│   │   └── useLocalStorage.js      # Synced persistent storage for trips and theme preferences
│   ├── lib/
│   │   ├── api.js                  # Centralized client network gateway
│   │   └── validateResult.js       # Defensive shape validation & normalization engine
│   ├── types/
│   │   └── result.js               # Structured itinerary schema definitions
│   ├── utils/
│   │   ├── jsonRepair.js           # Multi-heuristic client-side JSON parser & repair tool
│   │   └── mockData.js             # Inspiration prompts, category palettes, and FX exchange rates
│   ├── App.jsx                     # Top-level application coordinator
│   ├── index.css                   # Custom CSS tokens & iOS 18 glassmorphism styles
│   └── main.jsx                    # React 19 application mounting point
├── package.json                    # Scripts and dependencies (`npm start` launches client & proxy)
├── vercel.json                     # Serverless deployment configuration with proxy routing
└── README.md                       # Complete technical documentation
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** (v18.0.0 or higher recommended)
- **npm** (v9.0.0 or higher)

### Installation & Local Run

```bash
# 1. Clone the repository
git clone https://github.com/adarshhhgupta/wandering-globe.git
cd wandering-globe

# 2. Install all dependencies
npm install

# 3. Start both the Express proxy and Vite frontend concurrently
npm start
```

After starting:
- **Frontend Dashboard:** [http://localhost:5173/](http://localhost:5173/)
- **Backend Proxy Gateway:** [http://localhost:3001/](http://localhost:3001/)

> 💡 **Zero-Config Built-in Demo Mode:**  
> If no API key is configured, Wandering Globe automatically activates **Built-in Demo Mode**, utilizing verified high-fidelity mock datasets ([`server/mockTrips.js`](file:///c:/Users/adars/Documents/flamassignment/server/mockTrips.js)). You can immediately evaluate every feature, drag-and-drop interaction, and currency conversion without signing up for external API credits.

---

## 🔑 Environment Configuration (Optional)

To connect live inference with the **Groq Cloud API**:

1. Create a `.env` file in the project root:
   ```bash
   cp .env.example .env
   ```
2. Add your Groq API key (available for free at [console.groq.com/keys](https://console.groq.com/keys)):
   ```env
   GROQ_API_KEY=gsk_your_groq_api_key_here
   PORT=3001
   ```
3. *Alternative:* You can also click the **API Key** button in the top navigation bar of the running application to securely supply an API key for your local session without touching environment files.

---

## 🧪 Edge-Case Testing & System Reliability Lab

To verify how the application behaves when encountering upstream LLM anomalies, open the **Reliability Lab** by clicking the **Simulation** pill in the top header:

- **Malformed / Truncated JSON:** Transmits broken JSON syntax with unclosed braces to test the client-side heuristic repair engine (`jsonRepair.js`) and error boundary recovery.
- **Wrong Shape / Missing Schema:** Transmits valid JSON missing critical fields (such as the `days` array) to verify defensive schema validation guards.
- **Artificial 10s Timeout:** Injects a 10,000ms latency delay to test user loading telemetry, cancellation responsiveness, and `AbortController` termination.
- **429 Rate Limit Simulation:** Triggers HTTP 429 quota exceptions to verify exponential backoff messaging and user guidance.
- **500 Server Outage:** Simulates an unexpected proxy crash to verify graceful degradation and single-click fallback to cached demo data.
- **Stale Overwrite Demonstration:** Dispatches Request A (delayed by 3 seconds) followed immediately by Request B, proving that Request A is aborted and discarded before it can corrupt current application state.

---

## 👨‍💻 Author & Acknowledgements

Created and engineered by **Adarsh Gupta**:
- 🌐 **GitHub:** [@adarshhhgupta](https://github.com/adarshhhgupta)
- 💼 **LinkedIn:** [Adarsh Gupta](https://www.linkedin.com/in/adarsh-gupta-22a36b28a/)
- 📧 **Email:** [adarshgupta9890@gmail.com](mailto:adarshgupta9890@gmail.com)
- 🎥 **Project Video Demo:** [Watch on YouTube](https://youtu.be/UBTp_u8TOp4)

---

## 📄 License

This project is licensed under the **MIT License** — feel free to explore, fork, and adapt it for your own applications.

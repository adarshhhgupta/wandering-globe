# Wandering Globe — Autonomous AI Travel Architect and Real-Time Itinerary Engine

[![React](https://img.shields.io/badge/React-19.0-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-6.0-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4.21-000000?logo=express&logoColor=white)](https://expressjs.com/)
[![Groq Cloud](https://img.shields.io/badge/Groq_LPU-Inference-F55036?logo=groq&logoColor=white)](https://groq.com/)
[![Vercel](https://img.shields.io/badge/Deployment-Vercel-black?logo=vercel&logoColor=white)](https://vercel.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

> A production-grade web application that transforms free-form natural language travel queries into structured multi-day itineraries featuring real-time multi-currency recalculation, drag-and-drop stop management, and an enterprise failure-resilience pipeline.

---

### Links and Resources

- **Production Deployment:** [https://wandering-globe.vercel.app](https://wandering-globe.vercel.app)
- **Source Code Repository:** [https://github.com/adarshhhgupta/wandering-globe](https://github.com/adarshhhgupta/wandering-globe)
- **Technical Video Demonstration:** [https://youtu.be/UBTp_u8TOp4](https://youtu.be/UBTp_u8TOp4)

---

## Overview

Planning international travel is often complicated by fragmented resources, unstructured recommendations, and rigid scheduling tools.

**Wandering Globe** addresses this challenge by coupling low-latency LLM inference with an interactive, stateful client architecture. Unstructured text inputs are parsed and normalized into validated, strongly typed schemas that users can reorder, edit, refine, and budget dynamically.

```
"Plan a 4-day cultural exploration in Kyoto with traditional tea houses, scenic walks, and a $1,200 budget."
                                    │
                                    ▼
       ┌────────────────────────────────────────────────────────┐
       │             Wandering Globe Engine                     │
       │  • Groq LPU Inference (OpenAI GPT-OSS / Qwen / LLaMA)   │
       │  • Heuristic JSON Repair and Structural Validation     │
       │  • Real-Time Multi-Currency Recalculation Engine       │
       │  • Stateful Drag-and-Drop Timeline Architect           │
       └────────────────────────────────────────────────────────┘
                                    │
                                    ▼
                 [ Interactive Multi-Day Visual Dashboard ]
```

---

## Core Capabilities

- **Structured Itinerary Synthesis:** Generates chronological multi-day schedules complete with categorized activities (attractions, dining, cultural experiences, transit, leisure), time allocations, cost estimates, and geographical coordinates.
- **Conversational Refinement Loop:** Enables iterative modifications via follow-up prompts (e.g., *"Reduce Day 2 dining expenses"* or *"Add an evening walk near Gion"*) without requiring a full re-generation cycle.
- **Interactive Drag-and-Drop Scheduling:** Reorder activities within a single day or transfer stops across different days using HTML5 drag-and-drop and accessible touch controls.
- **Dynamic Multi-Currency Financial Engine:** Real-time budget conversion supporting five global currencies (USD, EUR, GBP, INR, JPY) with immediate recalculation of activity costs, daily totals, and aggregate expenditure based on dynamic foreign exchange ratios.
- **Resilient Parsing and Validation Pipeline:** Protects runtime stability through client-side heuristic JSON repair, strict structural schema enforcement, and asynchronous stale-response cancellation.
- **Fault Injection and Simulation Suite:** Built-in diagnostic control panel to validate application behavior against syntax truncation, missing schema fields, 10-second latency timeouts, 429 rate limits, and 500 internal server errors.
- **State Persistence and Portability:** Automatic synchronization with `localStorage`, single-click JSON export/import, and an immutable undo history stack.
- **Refined Glassmorphism Interface:** Implemented using vanilla CSS design tokens, 20px dock blur filtration, dual-transparency layering, responsive dynamic navigation, and a 60 FPS HTML5 radar canvas background.

---

## Technical Architecture and Design Patterns

The architecture enforces strict separation of concerns, secure credential boundaries, and defensive data processing.

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
                      │ 3. API Key Isolation (Zero Client Exposure)
                      ▼
            ┌───────────────────┐
            │ Groq Cloud Engine │  4. High-Speed LPU Inference
            │ (Groq SDK / LPU)  │ ──► Structured JSON Object
            └───────────────────┘
```

### 1. API Key Isolation Pattern
Private API credentials are kept strictly on the Node.js/Express proxy tier (`server/index.js` and Vercel serverless function `api/index.js`). The browser client interacts exclusively with application gateway endpoints (`/api/generate-trip`, `/api/refine-trip`), ensuring no secret tokens are exposed in network requests or client bundles.

### 2. Defensive Multi-Stage Parsing Pipeline
To handle unpredictable formatting, truncated responses, or non-compliant output from language models, the data pipeline implements three sequential verification phases:
1. **Extraction and Codeblock Sanitization:** Removes markdown delimiters (````json ... ````) and detects structural JSON object boundaries.
2. **Heuristic Syntax Repair (`src/utils/jsonRepair.js`):** Balances unclosed brackets/braces from token truncation, strips trailing commas preceding closing tokens, and normalizes improperly escaped characters.
3. **Runtime Schema Normalization (`src/lib/validateResult.js`):** Validates field types, injects default fallbacks for missing attributes, provisions unique identifiers, and programmatically computes budget aggregations.

### 3. Concurrency Protection and Stale Request Shielding
To resolve race conditions caused by network latency variability, requests are managed using `AbortController` cancellation signals combined with monotonically increasing `requestId` references inside `src/hooks/useTripPlanner.js`. Any asynchronous response whose identifier does not correspond to the currently active request is discarded immediately.

### 4. Dynamic FX Calculation Engine
Monetary figures are internally maintained in base USD and dynamically converted at display time using a centralized foreign exchange matrix (`1 USD = 86.50 INR`, `0.92 EUR`, `0.79 GBP`, `154.00 JPY`). Currency switching triggers immediate, consistent updates across all stop cards, daily summaries, and global budget indicators.

---

## Technology Stack and Technical Specifications

| Domain | Technologies and Libraries | Architecture and Technical Patterns |
| :--- | :--- | :--- |
| **Frontend Framework** | React 19, Vite 6, JavaScript (ES2023) | Finite State Machine, Custom Hooks (`useTripPlanner`, `useLocalStorage`), Unidirectional Data Flow |
| **User Interface** | Vanilla CSS, Lucide React, Canvas Confetti | iOS 18 Glassmorphism, HSL Design Tokens, 20px Blur Filtration, 44px Minimum Tap Targets, 60 FPS HTML5 Canvas |
| **Server and Proxy** | Node.js 18+, Express 4.21, Cors, Dotenv | API Gateway Pattern, Reverse Proxy, Key Isolation, Vercel Serverless Functions (`api/index.js`) |
| **AI Inference** | Groq Cloud SDK (`groq-sdk`) | Low-Latency Processing Unit (LPU), Structured Output Mode (`json_object`), Dynamic Prompt Templates |
| **Model Support** | `openai/gpt-oss-120b`, `llama-3.3-70b-versatile`, `qwen/qwen3.8-27b` | Automatic Model Failover, Adaptive Retry with Exponential Backoff |
| **Data Integrity** | Heuristic AST and Syntax Parser | Syntactic JSON Repair, Structural Schema Validation, UUID Provisioning, Deep State Immutability |
| **State Management** | React State and Web Storage API | Synchronized `localStorage` Persistence, Immutable Undo History, Monotonic Request Sequencing |

---

## Repository Structure

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
│   │   ├── ApiKeyModal.jsx         # In-browser client API key configuration modal
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
├── package.json                    # Scripts and dependencies (concurrent client & proxy launch)
├── vercel.json                     # Serverless deployment configuration with proxy routing
└── README.md                       # Technical documentation
```

---

## Getting Started

### Prerequisites
- **Node.js** (v18.0.0 or higher recommended)
- **npm** (v9.0.0 or higher)

### Installation and Local Execution

```bash
# 1. Clone the repository
git clone https://github.com/adarshhhgupta/wandering-globe.git
cd wandering-globe

# 2. Install dependencies
npm install

# 3. Start the Express proxy and Vite development server concurrently
npm start
```

Default access endpoints:
- **Frontend Application:** [http://localhost:5173/](http://localhost:5173/)
- **Backend Proxy Gateway:** [http://localhost:3001/](http://localhost:3001/)

> **Zero-Configuration Demo Mode:**  
> When an external API key is not supplied, the application automatically engages **Built-in Demo Mode** using verified dataset fixtures ([`server/mockTrips.js`](file:///c:/Users/adars/Documents/flamassignment/server/mockTrips.js)). Full interaction fidelity—including drag-and-drop reordering, timeline edits, and currency switching—remains functional without third-party credentials.

---

## Environment Configuration

To enable live LLM inference via the **Groq Cloud API**:

1. Create a `.env` file in the project root:
   ```bash
   cp .env.example .env
   ```
2. Specify your Groq API key:
   ```env
   GROQ_API_KEY=gsk_your_groq_api_key_here
   PORT=3001
   ```
3. *Runtime Configuration:* Users can also click the **API Key** button in the navigation header to assign a temporary session key directly within the browser interface.

---

## Reliability Testing and Fault Injection Suite

The embedded **Simulation Suite** allows engineers to test runtime recovery and defensive behaviors under adverse network or model conditions:

- **Malformed / Truncated JSON:** Emits incomplete JSON strings to test heuristic balance repair (`jsonRepair.js`) and error boundary safeguards.
- **Schema Non-Compliance:** Emits valid JSON lacking required schema structures (such as missing `days` arrays) to verify structural validation handlers.
- **High-Latency Delay (10s):** Injects an artificial 10,000ms delay to evaluate user telemetry indicators, UI responsiveness, and `AbortController` cancellation.
- **HTTP 429 Rate Limiting:** Triggers upstream quota exceptions to verify user advisory messaging and backoff guidance.
- **HTTP 500 Upstream Outage:** Simulates proxy service interruptions to verify failure notifications and one-click demo fallback options.
- **Stale Overwrite Prevention:** Sequentially fires Request A (delayed by 3 seconds) followed immediately by Request B, validating that Request A is cancelled and rejected before mutating application state.

---

## Author and Maintainer

Developed and maintained by **Adarsh Kumar Gupta**:
- **GitHub:** [@adarshhhgupta](https://github.com/adarshhhgupta)
- **LinkedIn:** [Adarsh Kumar Gupta](https://www.linkedin.com/in/adarsh-kumar-gupta-500b50224)
- **Email:** [adarshgupta9890@gmail.com](mailto:adarshgupta9890@gmail.com)
- **Video Walkthrough:** [Watch on YouTube](https://youtu.be/UBTp_u8TOp4)

---

## License

This project is distributed under the **MIT License**. Refer to the [LICENSE](LICENSE) file for complete terms and permissions.

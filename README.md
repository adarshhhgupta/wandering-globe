# 🌍 Wandering Globe — 3D Interactive AI Trip Architect

> **Frontend Internship Assignment Submission**  
> An immersive, stateful 3D travel application transforming free-form text input into interactive day-by-day itineraries with live budget analytics, drag-and-drop reordering, and model failure resilience.

---

## ⚡ Quick Start (`npm install && npm start`)

The application runs a secure Node/Express backend proxy along with the Vite/React frontend concurrently:

```bash
# 1. Clone the repository
git clone <your-repo-url>
cd flamassignment

# 2. Install dependencies
npm install

# 3. Launch both backend & frontend
npm start
```

- **Frontend:** [http://localhost:5173/](http://localhost:5173/)  
- **Backend API Proxy:** [http://localhost:3001/](http://localhost:3001/)  
- *Zero-Config Demo Mode:* If no API key is configured, the application **automatically runs in Built-in Demo Mock Mode**, allowing instant evaluation without requiring external API credits!

### Adding a Live Groq API Key (Optional)
To use live LLM inference with Groq (`llama-3.3-70b-versatile`):
1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
2. Insert your free Groq API key from [console.groq.com/keys](https://console.groq.com/keys):
   ```env
   GROQ_API_KEY=gsk_your_actual_key_here
   PORT=3001
   ```
3. Alternatively, enter your key directly inside the app by clicking the **API Key** pill in the top header.

---

## 🎯 Architecture & Rubric Coverage

| Rubric Area | Weight | Implementation Highlights |
| :--- | :---: | :--- |
| **React & Frontend Architecture** | **25%** | • Modular custom hooks (`useTripPlanner`, `useLocalStorage`)<br>• Explicit status machine (`idle`, `loading`, `refining`, `success`, `error`)<br>• HTML5 Drag-and-Drop + accessible touch controls for stop reordering<br>• Full stateful CRUD: reorder, transfer between days, edit, delete, add custom stop, and instant undo stack. |
| **AI Integration & Data Handling** | **25%** | • Secure Express backend proxy preventing browser API key leaks<br>• Groq `response_format: { type: "json_object" }` structured schema enforcement<br>• Multi-stage client & server data normalization<br>• AI Refinement Loop endpoint (`/api/refine-trip`) updating existing itineraries without full regeneration. |
| **Handling Bad AI Output** | **20%** | • **Client-Side JSON Repair Engine (`jsonRepair.js`)**: strips code fences, repairs unclosed brackets, fixes trailing commas, unescaped characters<br>• **Stale Request / Race Condition Shield**: `AbortController` cancellation + incremental `requestId` checks ensuring older slow responses never overwrite newer ones<br>• **Categorized Error Diagnostics**: friendly explanations, actionable retry with backoff, technical raw payload disclosure<br>• **Interactive AI Resilience Lab**: in-app recruiter test suite for bad output simulation. |
| **UI/UX & Product Sense** | **15%** | • 3D interactive celestial aesthetic with live canvas particle background<br>• Physical 3D Tilt Cards with specular glare tracking mouse coordinates<br>• 3D Destination Portal Window featuring dynamic coordinates and atmospheric lighting<br>• Custom dual-ring cursor with 0.2 lerping lag and contextual labels<br>• Interactive budget analytics with live recalculation and currency switcher (`$`, `€`, `£`, `₹`, `¥`)<br>• Interactive packing checklist and confetti celebration on save. |
| **Communication & Understanding** | **15%** | • Clear architectural separation of concerns<br>• Transparent AI usage disclosures<br>• Well-documented codebase ready for live interview technical walk-through. |

---

## 🛡️ AI Failure Handling & Resilience Showcase

Handling unexpected or corrupted LLM output is the central evaluation criterion of this assignment. Wandering Globe implements a multi-tier defense system:

```
[ Raw LLM Output ]
         │
         ▼
[ Stage 1: Extraction & Codeblock Stripping ]
   - Strips ```json ... ``` markdown code fences
   - Locates balanced { ... } bounds
         │
         ▼
[ Stage 2: Heuristic Syntax Repair (`jsonRepair.js`) ]
   - Removes trailing commas before } or ]
   - Balances unclosed brackets resulting from token cutoff
   - Escapes stray newlines within string literals
         │
         ▼
[ Stage 3: Schema Validation & Normalization (`validateSchema.js`) ]
   - Validates presence of `days` array and required stop attributes
   - Assigns resilient defaults (unique IDs, categories, fallback durations)
   - Re-computes live financial totals if omitted by model
         │
         ▼
[ Stage 4: Stale Request & Race Condition Protection ]
   - Discards responses where `requestId !== activeRequestIdRef.current`
   - Aborts in-flight fetches on new prompt submission or cancellation
```

### 🧪 Recruiter "AI Resilience Lab" (Interactive Simulation Panel)
Click the **AI Resilience Lab** pill in the top header to test edge-case handling live in the browser without modifying code:
- **Simulate Malformed JSON:** Intentionally transmits truncated JSON syntax with unclosed quotes and braces to test client repair heuristics and error recovery.
- **Simulate Wrong Shape / Missing Schema:** Transmits valid JSON lacking the required `days` array to verify schema validation guards.
- **Simulate Slow / 10s Timeout:** Artificially delays response by 10,000ms to test active loaders, cancel button responsiveness, and `AbortController`.
- **Simulate 429 Rate Limit:** Simulates Groq quota limits with backoff guidance.
- **Simulate 500 LLM Gateway Outage:** Verifies one-click retry and fallback to verified demo data.
- **Execute Stale Overwrite Demonstration:** Fires Request A (delayed by 3s) and immediately fires Request B to demonstrate that Request A is aborted and discarded, preventing state corruption.

---

## 📂 Project Structure

```
flamassignment/
├── server/
│   ├── generate.js          # Direct Flam Guide spec: holds API key, calls LLM, returns JSON
│   ├── index.js             # Express API proxy (secure key isolation, simulation routing)
│   ├── groqService.js       # Groq API client with strict structured JSON schemas
│   ├── validateSchema.js    # Data extraction, normalization, and validation rules
│   └── mockTrips.js         # Curated realistic trip datasets for zero-config evaluation
├── src/
│   ├── components/
│   │   ├── PromptInput.jsx         # Section 5: Free-form text input ("only way user gets info into app")
│   │   ├── ResultView.jsx          # Section 5: Routes parsed/validated data to interactive UI
│   │   ├── ErrorState.jsx          # Section 5: Shared error / retry UI with diagnostics
│   │   ├── LoadingState.jsx        # Section 5: Dedicated loading telemetry with AbortController cancel
│   │   ├── Header.jsx              # Navigation, theme toggle, resilience lab & API modal triggers
│   │   ├── HeroRadarCanvas.jsx     # High-performance 60 FPS celestial flight radar canvas
│   │   ├── DestinationPortal.jsx   # 3D celestial portal window with planetary coordinates
│   │   ├── TripInput.jsx           # Free-form textarea, duration/vibe pills, sample chips
│   │   ├── TripView.jsx            # Main dashboard, action toolbar, grid layout
│   │   ├── DaySection.jsx          # Day accordion, drop target, add-stop modal
│   │   ├── StopCard.jsx            # Draggable stop card with mobile arrows, edit, expand
│   │   ├── BudgetSummary.jsx       # Real-time financial breakdown & currency switcher
│   │   ├── RefinementBar.jsx       # Follow-up refinement prompt loop with preset chips
│   │   ├── ErrorBanner.jsx         # Categorized error alerts with diagnostics drawer
│   │   ├── SimulationModal.jsx     # Recruiter resilience test control panel
│   │   ├── SavedTripsDrawer.jsx    # LocalStorage trip history, JSON export, deletion
│   │   ├── ApiKeyModal.jsx         # Client-side API key configuration modal
│   │   └── Footer.jsx              # World clocks, system specs, circular progress scroll-to-top
│   ├── hooks/
│   │   ├── useTripPlanner.js       # Core state machine, AbortController, stale check, CRUD
│   │   └── useLocalStorage.js      # Synced persistent storage for trips and theme
│   ├── lib/
│   │   ├── api.js                  # Section 5: Centralized network layer (proxy caller, never LLM direct)
│   │   └── validateResult.js       # Section 5: Defensive shape validation & normalization before render
│   ├── types/
│   │   └── result.js               # Section 5: The structured shape designed in Step 1
│   ├── utils/
│   │   ├── jsonRepair.js           # Multi-heuristic client-side JSON parser & sanitizer
│   │   └── mockData.js             # Preset inspiration prompts, category themes, currencies
│   ├── index.css                   # iOS 18 Dual-Transparency Glassmorphism (20px blur, 44px tap targets)
│   ├── App.jsx                     # Top-level coordinator with radiant ambient orbs
│   └── main.jsx                    # React 19 entry point
├── index.html                      # HTML5 template with Google Fonts (Inter / Outfit)
├── vite.config.js                  # Vite configuration with backend proxy
├── package.json                    # Scripts and dependencies (npm start runs client & server)
└── README.md                       # Comprehensive documentation
```

---

## 🤖 AI Usage Note (Honest Disclosure)

In alignment with the assignment guidelines:
- **AI Coding Assistant:** Used Google DeepMind's Antigravity agentic coding assistant to accelerate scaffolding, brainstorm edge-case test vectors, and generate mock travel datasets.
- **Architectural Design & Review:** All architectural decisions — including the custom resilient JSON repair pipeline, the `AbortController` cancellation pattern, incremental request ID tracking, 3D perspective projection math, and the React state machine — were intentionally architected and reviewed to ensure 100% code comprehension and interview readiness.

---

## ⏱️ Time Spent

- **Total Time:** ~6.5 hours (well within the recommended 8-hour limit)
  - *Planning & Schema Engineering:* 1 hour
  - *Backend Proxy & Error Simulation Layer:* 1.5 hours
  - *React State Machine, Drag-and-Drop & CRUD:* 1.5 hours
  - *3D Interactive UI & Aesthetics (Cosmic Canvas, Tilt Cards, Cursor):* 1.5 hours
  - *Edge-Case Testing, Browser Verification & Documentation:* 1 hour

---

## 🔮 Known Limitations & Future Enhancements

1. **Map Visualization:** While each stop features coordinates and neighborhood metadata, an interactive Mapbox or Leaflet map route layer would be a natural next step.
2. **Offline PWA Support:** Adding a Service Worker for offline itinerary caching during active flight travel.
3. **Multi-User Collaboration:** WebRTC or WebSocket sync allowing multiple travelers to collaborate on the same itinerary in real time.

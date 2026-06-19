# Carbon Compass

An AI-Powered Carbon Decision Assistant built as a premium web application to help individuals understand, simulate, and reduce their daily carbon footprint.

---

## 🌟 Hero Philosophy
*People don't care about numbers. They care about decisions.*

Unlike traditional carbon calculators that overwhelm users with graphs and metrics, **Carbon Compass** acts as an interactive assistant. It answers "What If" scenarios in real-time, translates CO₂ kilograms into physical stories, and provides a personalized, AI-informed roadmap.

---

## 🎯 Challenge & Solution Brief

### 1. Chosen Vertical
* **Primary Focus**: **UN SDG 13: Climate Action** (Specifically targeted at Individual Behavioral Decarbonization & Lifestyle Carbon Simulation).
* **Persona**: The *Eco-Conscious but Overwhelmed Citizen* who wants to transition to a low-carbon lifestyle but struggles with abstract carbon statistics (e.g., "What does 5 kg of CO₂ even mean?").

### 2. Approach and Logic
* **Decision-First Architecture**: Standard calculators focus on backward-looking analysis. Carbon Compass focuses on forward-looking "what-if" simulations (e.g. comparing diet changes, daily transport alterations, energy setups).
* **Hybrid Reasoning Model**: Combines deterministic calculations (using EPA & Defra emission factors) for local inputs and probabilistic calculations (using Google's Gemini Generative AI) for open-ended user queries.
* **Context-Aware Prompting**: When the user chats with the AI, the assistant receives the user's specific lifestyle baseline (e.g., whether they drive an SUV or live in a solar-powered apartment). This enables the AI to give highly tailored, context-specific suggestions rather than generic advice.

### 3. How the Solution Works
* **Onboarding & Baseline**: Calculates a starting carbon profile based on lifestyle parameters (diet, transport, housing, energy).
* **Real-Time Sandbox Simulator**: Users can adjust sliders and toggles (e.g., commute days, AC hours) to see dynamic, interactive footprint adjustments.
* **Semantic Story Cards**: Translates abstract kg emissions into physical stories (e.g. equivalent gas cylinders, tree seedlings growing for 10 years) to foster empathy and clarity.
* **AI Decision Assistant**: A secure route handler powered by `@google/genai` that parses unstructured queries, calculates carbon trade-offs, and returns structured JSON containing CO₂ savings, impact levels, and custom checklist suggestions.
* **Privacy-First Local Action Journey**: Users can check off carbon-reducing tasks stored locally in `IndexedDB` (using `Dexie.js` and synchronized via `Zustand`).

### 4. Key Assumptions Made
* **Local Sandboxed Execution**: Assumes the user prefers maximum privacy. Thus, no server-side user database is used; all profile and chat history reside in browser IndexedDB.
* **Factor Averages**: Uses EPA (US Environmental Protection Agency) and Defra (UK Department for Environment, Food & Rural Affairs) emission factors as representative global baselines for passenger vehicles, diets, electricity consumption, and diet options.
* **API Access**: Assumes a valid `GEMINI_API_KEY` is provided in environment variables for AI features to execute.

---

## 🛠️ Technology Stack
- **Framework**: Next.js 15 (App Router, React 19)
- **Language**: TypeScript
- **Styling**: Tailwind CSS (v4)
- **State Management**: Zustand
- **Local Storage**: IndexedDB (using Dexie.js)
- **AI Core**: Gemini (using official `@google/genai` SDK)
- **Validations**: Zod
- **Testing**: Vitest & React Testing Library (Unit/Component), Playwright (E2E)

---

## 📂 Project Architecture

```
src/
├── app/
│   ├── api/
│   │   └── assistant/
│   │       └── route.ts         # Secure API endpoint calling Gemini
│   ├── globals.css              # Custom themes, glassmorphism, accessibility focus lines
│   ├── layout.tsx               # Accessibility skip-link, Outfit/Geist fonts, document structure
│   └── page.tsx                 # Dashboard view: simulator + tabs for AI assistant and Action Journey
├── components/                  # Global shared UI components
├── features/
│   ├── assistant/
│   │   └── assistant.tsx        # AI Assistant Chat Interface with JSON response rendering
│   ├── footprint/
│   │   └── calculations.ts      # Footprint calculation logic using EPA/Defra factors
│   ├── insights/
│   │   ├── journey.tsx          # Adaptive Action Roadmap (interactive roadmap checklists)
│   │   └── story-cards.tsx      # Translations of carbon figures to seedling growth, gas, charging
│   ├── onboarding/
│   │   └── onboarding.tsx       # Onboarding questionnaire wizard (diet, transit, housing)
├── lib/
│   ├── db.ts                    # Dexie.js IndexedDB local database instance
│   └── gemini.ts                # Server-side Gemini SDK helper with JSON schemas
├── stores/
│   └── useAppStore.ts           # Zustand store synchronized with IndexedDB
├── tests/
│   ├── calculations.test.ts     # Footprint calculations Vitest tests
│   ├── onboarding.test.tsx      # Onboarding component Vitest tests
│   └── e2e.spec.ts              # Playwright E2E browser test
```

---

## 💾 Storage Design (IndexedDB)
The application is **privacy-first**. No signup, login, or cookies are implemented. All data resides in browser sandbox databases using **Dexie.js**:

1. **`profile`**: Stores the initial user lifestyle profile (diet, car type, commute frequency, solar panels, air conditioning settings).
2. **`chat_history`**: Persistent user-assistant message log (persisted on-device).
3. **`journey`**: Checklist roadmap tracking weekly carbon-reduction actions and completion statuses.

---

## 🚀 Setup & Installation

### 1. Clone & Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Create a `.env.local` file in the root directory and add your Gemini API Key:
```env
GEMINI_API_KEY=your_gemini_api_key_here
```

### 3. Start Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🧪 Testing

### Run Unit & Component Tests (Vitest)
```bash
npm run test
```

### Run End-to-End Tests (Playwright)
Ensure the server is running or configure Playwright to build:
```bash
npx playwright install chromium
npm run test:e2e
```

---

## ♿ Accessibility & Design
- **WCAG 2.2 AA Compliance**: Semantic HTML5 tags (`<main>`, `<header>`, `<section>`), custom high-contrast focus rings, custom labels connected to form inputs via `for/id`.
- **Keyboard Friendly**: Fully navigatable using `Tab`, `Shift+Tab`, `Space`, `Enter`, and Arrow keys.
- **Reduced Motion**: Respects browser settings. Toggles off heavy Framer Motion transitions automatically if `prefers-reduced-motion` is active.
- **Screen Reader Announcements**: Live region (`aria-live="polite"`) notifies screen reader users of onboarding steps, chatbot statuses, and roadmap checkbox updates.

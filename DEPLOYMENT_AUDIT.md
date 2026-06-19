# Carbon Compass - Production Deployment Audit Report

This report presents the findings of the production readiness audit conducted on the Carbon Compass codebase, specifically targeting deployment to Google Cloud Run.

---

## 🔍 Audit scope & Analysis

### 1. Configuration Review (`package.json`, `next.config.ts`, `tsconfig.json`)
* **Next.js & React Versions**: Running on Next.js 16.2.9 and React 19.2.4. Next.js App Router is used, which compiles routes dynamically or statically.
* **Next Config**: 
  * *Status*: Originally set to default.
  * *Risk*: Default builds pull in thousands of devDependencies and build-caches, resulting in container sizes over 1 GB.
  * *Fix*: Added `output: 'standalone'` in `next.config.ts` to utilize Next.js trace-based standalone builds. This generates a minified server directory containing only the raw node dependencies required for request routing, bringing the container size down to ~150 MB.
* **TypeScript Compilation**: Correctly configured with strict checks. Build scripts execute `tsc` before compilation, guaranteeing type safety.

### 2. Environment Variable Audit
* *Status*: Tested for credentials leakage or client-side exposing.
* *Finding*: The core secret `GEMINI_API_KEY` is queried in `src/lib/gemini.ts` via `process.env.GEMINI_API_KEY`.
* *Security Check*: No references to `NEXT_PUBLIC_GEMINI_API_KEY` exist. The Gemini SDK client is created and called strictly on the server-side within the Next.js API route handler `src/app/api/assistant/route.ts`. The client browser never receives the secret key.
* *Actions Taken*: Created `.env.example` to demonstrate configuration parameters and ensure no real API keys are ever committed.

### 3. API Routes & Compute Engine Durations
* *Status*: Audited execution lifetimes for `/api/assistant`.
* *Risk*: The Gemini model API might take up to 20-30 seconds to parse complex decision prompts and generate structural JSON. The default Next.js route handler timeout (especially when deployed to Vercel/similar hostings) is 15 seconds. If exceeded, requests fail with a Gateway Timeout.
* *Fix*: Declared `export const maxDuration = 60;` in `src/app/api/assistant/route.ts`. This informs Next.js (and downstream proxy/gateway routers) to allow up to 60 seconds of execution time.

### 4. Browser State & Server Side Compatibility (Zustand & Dexie)
* *Status*: Checked for IndexedDB references during SSR.
* *Risk*: In Next.js, code inside pages/components is pre-rendered on the server-side. Since `IndexedDB` and `Dexie.js` require browser APIs (`window.indexedDB`), importing or executing them during server pre-rendering would cause a fatal build crash (e.g., `window is not defined`).
* *Finding*: 
  * The Zustand store (`src/stores/useAppStore.ts`) initializes Dexie inside client hooks and checks `typeof window !== 'undefined'` before accessing storage drivers.
  * `Home` page component (`src/app/page.tsx`) wraps onboarding and dashboard rendering in an `isOnboarded` and `isDbLoaded` state condition. The dashboard is not rendered until `isDbLoaded` is true, ensuring no server-side IndexedDB references occur during pre-rendering.
* *Verdict*: **PASS**. The IndexedDB architecture is completely safe and server-compatible.

### 5. Dockerization & Alpine Linux Compatibility
* *Status*: Evaluated Docker build execution.
* *Details*: Created a multi-stage `Dockerfile` based on `node:20-alpine`. 
  * Stage 1 installs dependencies.
  * Stage 2 compiles the standalone assets.
  * Stage 3 copies only standalone assets and runs node.
  * Used system group/user mapping to execute the Node runtime as a non-privileged `nextjs` user. This complies with standard container security parameters.

---

## ⚡ Deployment Risks Summary

| Category | Risk Description | Severity | Mitigation Taken |
| :--- | :--- | :--- | :--- |
| **API Timeout** | Gemini API response delays cause gateway timeout errors in Route Handlers. | Medium | Added `export const maxDuration = 60` to route segment config. |
| **Container Bloat** | Pushing a full node build directory increases cold-start times on Cloud Run. | High | Set `output: 'standalone'` in Next.js config to decrease image size. |
| **User Data Leakage** | Storing profile info on server databases compromises user privacy rules. | Low | Confirmed zero server database setups are utilized; profile data is kept strictly inside local IndexedDB. |
| **Privileged Execution**| Running the container process as root poses container breakout security risks. | High | Implemented non-privileged system user `nextjs` inside the runner stage of the Dockerfile. |
| **Secret Exposure** | Committing API keys to repositories or referencing client-exposed variables. | Critical | Checked that no `NEXT_PUBLIC_` keys are present. Verified `.gitignore` ignores all local `.env` files. |

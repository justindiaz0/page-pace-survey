# Working Notes — Page Pace Survey

> **INTERNAL DOCUMENT — NOT PUBLIC FACING**
> This file is for the developer and any AI assistants working on this project.
> Update this file at the end of every working session before closing.

---

## How to Use This File (For AI Assistants)

1. Read this entire file before touching any code or making any suggestions.
2. Read `README.md` for public-facing project context, tech stack, and structure.
3. Do not change the folder structure or file naming conventions without discussing it first.
4. Follow all conventions in the CONVENTIONS section exactly — do not introduce new patterns.
5. Do not suggest anything listed under "What Was Tried and Rejected."
6. Ask before making any large structural changes (routing, database schema, build config).
7. This project was partially vibe-coded and AI-assisted — refactor conservatively and only when necessary. Prefer targeted edits over rewrites.

---

## Current State

**Last Updated:** 2026-04-01

The app is fully functional in development (Replit). Supabase is connected and the `survey_responses` table has been created with RLS policies. Azure Static Web Apps routing config is in place. The app has not yet been deployed to Azure — that step is in progress.

### What Is Working
- [x] Home page with "Take Survey" and "View Results" navigation
- [x] Seven-question survey form with validation (React Hook Form + Zod)
- [x] Form submission saves to Supabase (`survey_responses` table)
- [x] Success confirmation screen after submission
- [x] Results page fetches all rows from Supabase and aggregates client-side
- [x] Five charts on results page (bar, horizontal bar, pie) using Recharts
- [x] Responsive layout — mobile, tablet, desktop
- [x] Footer on every page: "Survey by Justin Diaz, BAIS:3300 - Spring 2026"
- [x] Purple accent theme with proper Tailwind CSS variables
- [x] `staticwebapp.config.json` added for Azure SPA routing
- [x] `README.md` and `WORKING_NOTES.md` created

### What Is Partially Built
- [ ] Azure Static Web Apps deployment — config is ready, deployment not yet completed
- [ ] Environment variables not yet configured in Azure portal

### What Is Not Started
- [ ] Duplicate submission prevention
- [ ] CSV export for responses
- [ ] Admin/private view for open-text responses
- [ ] Real-time response count with Supabase Realtime

---

## Current Task

Setting up deployment to Azure Static Web Apps. The `staticwebapp.config.json` is in place and the Vite build output is confirmed at `artifacts/page-pace-survey/dist/public`. The user needs to connect the GitHub repo (`page-pace-survey`) to Azure and configure the environment variables (`VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`) in the Azure portal.

**Next step:** Complete Azure Static Web App creation in the Azure portal using the `page-pace-survey` GitHub repository.

---

## Architecture and Tech Stack

| Technology | Version | Why It Was Chosen |
|---|---|---|
| React | 18 | Specified in PRD; component-based UI |
| Vite | 7 | Fast dev server and optimized static builds |
| TypeScript | 5.9 | Type safety across the codebase |
| Tailwind CSS | 4 | Utility-first styling, fast iteration |
| shadcn/ui | latest | Accessible, unstyled Radix-based components |
| Wouter | 3 | Lightweight router, no React Router overhead needed |
| React Hook Form | 7 | Controlled form state with good performance |
| Zod | 3 | Schema validation integrated with RHF via zodResolver |
| Supabase JS Client | 2 | Specified in PRD; direct DB access from frontend |
| Supabase PostgreSQL | managed | Specified in PRD; hosted PostgreSQL with RLS |
| Recharts | 2 | Specified in PRD; React-native charting |
| Azure Static Web Apps | — | Specified in PRD; static hosting for Vite output |
| pnpm workspaces | 10 | Monorepo package management (Replit scaffold) |

---

## Project Structure Notes

```
artifacts/page-pace-survey/
├── public/
│   ├── favicon.svg
│   ├── opengraph.jpg
│   └── staticwebapp.config.json     # Azure SPA routing — DO NOT REMOVE
├── src/
│   ├── components/
│   │   ├── layout.tsx               # Wraps all pages; contains footer
│   │   └── ui/                      # shadcn/ui — do not hand-edit these files
│   ├── hooks/
│   │   ├── use-mobile.tsx
│   │   └── use-toast.ts
│   ├── lib/
│   │   ├── supabase.ts              # Supabase client + types + aggregateField helper
│   │   └── utils.ts                 # cn() utility only
│   ├── pages/
│   │   ├── home.tsx                 # Route: /
│   │   ├── survey.tsx               # Route: /survey
│   │   ├── results.tsx              # Route: /results
│   │   └── not-found.tsx            # Catch-all 404
│   ├── App.tsx                      # WouterRouter with base path
│   ├── main.tsx                     # ReactDOM.createRoot entry
│   └── index.css                    # All Tailwind theme variables (HSL)
├── vite.config.ts                   # Reads PORT and BASE_PATH from env
├── tsconfig.json
└── package.json
```

### Non-Obvious Decisions

- The app lives inside a **pnpm monorepo** (Replit scaffold). The workspace root is two levels up from `artifacts/page-pace-survey/`. All install commands must be run from the workspace root with `--filter`.
- `vite.config.ts` reads `PORT` and `BASE_PATH` from environment variables — it will throw if these are missing. In Replit these are set automatically. For local dev outside Replit, set them manually.
- The Supabase client is initialized in `src/lib/supabase.ts` and imported directly into page components. There is no API server involved for database operations — the frontend calls Supabase directly.
- Results aggregation is done **client-side** in `results.tsx` using the `aggregateField` helper from `supabase.ts`. All rows are fetched and grouped in the browser.

### Files/Folders That Must Not Be Changed Without Discussion

- `public/staticwebapp.config.json` — removing this breaks Azure SPA routing
- `src/lib/supabase.ts` — changing the `SurveyRow` interface must be mirrored in the Supabase table schema
- `vite.config.ts` — PORT and BASE_PATH handling is required for the Replit environment
- `src/components/ui/` — shadcn/ui generated files; do not hand-edit

---

## Data / Database

**Provider:** Supabase PostgreSQL (hosted)
**Project URL:** `https://urrbdixfwvlgnmvmoqhq.supabase.co`

### Table: `survey_responses`

| Field | Type | Required | Notes |
|---|---|---|---|
| id | SERIAL | auto | Primary key |
| created_at | TIMESTAMPTZ | auto | Defaults to NOW() |
| reading_frequency | TEXT | yes | Q1 — radio button answer |
| reading_time | TEXT | yes | Q2 — dropdown answer |
| distractions | TEXT[] | yes | Q3 — multi-select checkboxes |
| reading_duration | TEXT | yes | Q4 — dropdown answer |
| skipping_feeling | TEXT | yes | Q5 — radio button answer |
| consistency_helpers | TEXT[] | yes | Q6 — multi-select checkboxes |
| struggle_reason | TEXT | yes | Q7 — free text |

**RLS Policies:**
- Public INSERT allowed (`Allow public inserts`)
- Public SELECT allowed (`Allow public reads`)

---

## Conventions

### Naming Conventions
- React components: PascalCase (`SurveyForm`, `ResultsPage`)
- Files: kebab-case for pages and libs (`survey.tsx`, `supabase.ts`)
- CSS variables: kebab-case HSL values, no `hsl()` wrapper in variable declaration
- Supabase table and column names: snake_case to match PostgreSQL convention

### Code Style
- TypeScript strict mode — no `any` unless unavoidable
- No `console.log` in committed code
- Imports: React hooks from `"react"`, UI from `"@/components/ui/..."`, lib from `"@/lib/..."`
- Do not import React explicitly — Vite JSX transform handles it
- Unused imports cause TypeScript build failures — always clean up

### Framework Patterns
- Forms: always use `react-hook-form` with `zodResolver` — never uncontrolled inputs
- Routing: Wouter `<Link>` for navigation, never `window.location`
- Supabase calls: async/await with explicit error handling (`const { data, error } = await supabase...`)
- Component state: `useState` for local UI state; no global state manager needed

### Git Commit Style
- Format: `type: short description` (e.g., `feat: add results page`, `fix: correct chart labels`)
- Types: `feat`, `fix`, `chore`, `docs`, `style`, `refactor`

---

## Decisions and Tradeoffs

- **Decision made:** Frontend calls Supabase directly (no API server for survey data). Reason: the PRD specified Supabase with anon key, the anon key is public-safe with RLS, and eliminating the API layer keeps the deployment simpler for a static host. Do not suggest adding an API server for survey reads/writes.
- **Decision made:** Results are aggregated client-side. Reason: response volume is small (class-sized), Supabase does not have a built-in GROUP BY endpoint in the JS client without Edge Functions. Do not suggest moving aggregation to the server unless response count exceeds several thousand.
- **Decision made:** No authentication. Reason: survey is intentionally anonymous and public. Do not suggest adding login or auth.
- **Decision made:** Deployed to Azure Static Web Apps. Reason: specified in the PRD. Do not suggest Vercel, Netlify, or other hosts.
- **Decision made:** pnpm monorepo structure retained from Replit scaffold. Reason: required for Replit environment. Do not suggest flattening the project structure.

---

## What Was Tried and Rejected

- **Using the Replit built-in PostgreSQL instead of Supabase** — user explicitly wanted Supabase as specified in the PRD. Do not suggest switching back.
- **Using the API server (Express) for survey submissions** — the original scaffold used an Express API server with Drizzle ORM. This was replaced with direct Supabase JS client calls from the frontend. Do not suggest re-adding Express routes for survey data.
- **Storing reading_duration under the `motivation` field** — the design subagent initially mapped Q4 (reading duration) to a `motivation` field to fit the original API schema. This was corrected when switching to Supabase. Do not use `motivation` as a field name.

---

## Known Issues and Workarounds

- **Issue:** No duplicate submission prevention. A user can submit the survey multiple times.
  - Workaround: None currently. Acceptable for a small class-sized survey.
  - Do not remove any existing code thinking it prevents this — it does not exist yet.

- **Issue:** Results page loads all rows from Supabase into the browser before aggregating.
  - Workaround: Acceptable at current scale. Would need server-side aggregation (Supabase Edge Functions or a PostgreSQL view) if responses exceed a few thousand.
  - Do not remove the client-side `aggregateField` helper without a replacement.

- **Issue:** Pie chart labels overlap at small percentages.
  - Workaround: Labels are rendered with `labelLine={false}`. No fix yet.
  - Known cosmetic issue — do not attempt to fix without user request.

---

## Browser / Environment Compatibility

### Front-end
- Tested in: Chrome (latest), Edge (latest)
- Expected support: all modern browsers (Chrome, Firefox, Safari, Edge)
- Known incompatibilities: CSS `color-mix()` and `hsl(from ...)` used in `index.css` may not render correctly in Safari 15 and below — visual-only issue, no functional impact

### Back-end / Build Environment
- OS: Linux (Replit NixOS container)
- Node.js: v24
- pnpm: v10
- All commands must be run from the workspace root (`/home/runner/workspace`) using `--filter @workspace/page-pace-survey`
- `PORT` and `BASE_PATH` environment variables are required at dev server startup — set automatically by Replit, must be set manually for local dev outside Replit

---

## Open Questions

- Should the results page be restricted (password-protected) before the survey period ends, so respondents cannot see results until data collection is complete?
- Should a timestamp or session ID be stored to detect duplicate submissions in the future?
- Will the Azure deployment use a custom domain, or the default `.azurestaticapps.net` URL?
- Should the `VITE_SUPABASE_ANON_KEY` be rotated after the course is complete to prevent unauthorized writes?

---

## Session Log

### 2026-04-01
**Accomplished:**
- Scaffolded full React + Vite survey app in Replit pnpm monorepo
- Built all three pages: Home, Survey (7 questions, full validation), Results (5 charts)
- Connected Supabase — created table, RLS policies, and wired JS client to frontend
- Added `staticwebapp.config.json` for Azure SPA routing
- Generated README.md and WORKING_NOTES.md

**Left Incomplete:**
- Azure Static Web Apps deployment not yet completed (in progress)
- Environment variables not yet added in Azure portal

**Decisions Made:**
- Use Supabase JS client directly from frontend (no Express API for survey data)
- Aggregate results client-side using custom `aggregateField` helper
- Deploy to Azure Static Web Apps as specified in PRD

**Next Step:** Complete Azure Static Web App setup in the Azure portal — select `page-pace-survey` repo, set build output to `dist/public`, add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` as application settings.

---

## Useful References

- [Supabase JS Client Docs](https://supabase.com/docs/reference/javascript/introduction)
- [Supabase Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
- [Recharts API Reference](https://recharts.org/en-US/api)
- [shadcn/ui Component Docs](https://ui.shadcn.com/docs/components)
- [Azure Static Web Apps Routing](https://learn.microsoft.com/en-us/azure/static-web-apps/configuration)
- [Vite Build Options](https://vitejs.dev/config/build-options.html)
- [React Hook Form + Zod](https://react-hook-form.com/get-started#SchemaValidation)
- **AI Tools Used:** Replit AI Agent — used to scaffold the entire application, implement Supabase integration, generate documentation, and advise on Azure deployment configuration.

# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Each package manages its own dependencies.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM (API server); Supabase PostgreSQL (survey frontend)
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)

## Structure

```text
artifacts-monorepo/
├── artifacts/              # Deployable applications
│   ├── api-server/         # Express API server
│   └── page-pace-survey/   # Page Pace Survey React + Vite app
├── lib/                    # Shared libraries
│   ├── api-spec/           # OpenAPI spec + Orval codegen config
│   ├── api-client-react/   # Generated React Query hooks
│   ├── api-zod/            # Generated Zod schemas from OpenAPI
│   └── db/                 # Drizzle ORM schema + DB connection
├── scripts/                # Utility scripts (single workspace package)
├── pnpm-workspace.yaml     # pnpm workspace
├── tsconfig.base.json      # Shared TS options
├── tsconfig.json           # Root TS project references
└── package.json            # Root package with hoisted devDeps
```

## Page Pace Survey (`artifacts/page-pace-survey`)

A React + Vite survey tool for university students about personal reading habits.

- **Routes**: `/` (home), `/survey` (7-question form), `/results` (aggregated charts)
- **Database**: Supabase PostgreSQL — frontend calls Supabase JS client directly (no API server)
- **Charts**: Recharts (bar, horizontal bar, pie)
- **Deployment**: Azure Static Web Apps — `staticwebapp.config.json` in `public/`
- **Build output**: `artifacts/page-pace-survey/dist/public`
- **Supabase table**: `survey_responses` with RLS policies for public insert/select

### Environment Variables Required
- `VITE_SUPABASE_URL` — Supabase project URL
- `VITE_SUPABASE_ANON_KEY` — Supabase anon key (stored as Replit secret)

## TypeScript & Composite Projects

Every package extends `tsconfig.base.json` which sets `composite: true`. The root `tsconfig.json` lists all packages as project references.

- **Always typecheck from the root** — run `pnpm run typecheck`
- **`emitDeclarationOnly`** — we only emit `.d.ts` files during typecheck
- **Project references** — when package A depends on package B, A's `tsconfig.json` must list B in its `references` array

## Root Scripts

- `pnpm run build` — runs `typecheck` first, then recursively runs `build` in all packages
- `pnpm run typecheck` — runs `tsc --build --emitDeclarationOnly` using project references

## Packages

### `artifacts/api-server` (`@workspace/api-server`)

Express 5 API server. Routes include health check and survey endpoints (these are not used by the frontend — the frontend calls Supabase directly).

### `artifacts/page-pace-survey` (`@workspace/page-pace-survey`)

React + Vite survey app. Uses Supabase JS client directly for all database operations.

- See `artifacts/page-pace-survey/README.md` for full documentation
- See `artifacts/page-pace-survey/WORKING_NOTES.md` for internal developer notes

### `lib/db` (`@workspace/db`)

Database layer using Drizzle ORM with PostgreSQL. Contains `survey_responses` schema (used by API server; frontend uses Supabase directly).

### `lib/api-spec` (`@workspace/api-spec`)

Owns the OpenAPI 3.1 spec and Orval config. Run codegen: `pnpm --filter @workspace/api-spec run codegen`

### `lib/api-zod` (`@workspace/api-zod`)

Generated Zod schemas from the OpenAPI spec.

### `lib/api-client-react` (`@workspace/api-client-react`)

Generated React Query hooks from the OpenAPI spec.

### `scripts` (`@workspace/scripts`)

Utility scripts package.

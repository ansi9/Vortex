# Vortex Pro — Safe Transit

**PREDICT. PREVENT. PROTECT.**

Vortex Pro is a safety-first transit companion app that helps commuters avoid crowded, high-risk areas and get help fast in an emergency. It combines live crowd forecasting, an interactive congestion map, an AI-powered trip assistant, and a one-tap SOS mode into a single, polished mobile-first web app.

## Features

- **Landing experience** — branded splash screen with a slide-to-unlock control (with a fallback button) that transitions into the app.
- **Dashboard** — at-a-glance status header with summary cards for next arrival, crowd level, and safety score, plus a quick-route advisory.
- **Crowd Forecast** — animated bar chart of station density by hour, with a Today/Tomorrow toggle and smart tips.
- **Live Map** — stylized map with tappable congestion markers (high = avoid, low = safe) and area details.
- **AI Trip Assistant** — floating chat assistant that generates a tailored safety checklist based on trip length.
- **SOS mode** — full-screen emergency overlay with live location broadcasting, nearest safe-zone navigation, and quick actions (call police, medical, alert parents, record audio).

> Note: transit data, live geolocation, and SOS dispatch are simulated/mocked — there's no real backend integration for these yet.

## Tech Stack

- **Monorepo:** pnpm workspaces, Node.js 24, TypeScript 5.9
- **Frontend:** React 19, Vite, Tailwind CSS 4, shadcn/ui, Radix UI, Framer Motion, wouter (routing), TanStack Query
- **Backend:** Express 5, Pino (logging)
- **Database:** PostgreSQL + Drizzle ORM
- **Validation / API contracts:** Zod, Orval (OpenAPI codegen)
- **Build:** esbuild

## Project Structure

```
artifacts/
  vortex-pro/       # Main React frontend (the app itself)
  api-server/        # Express API server
  mockup-sandbox/    # Component/mockup preview sandbox
lib/
  api-zod/            # Generated Zod schemas from API spec
  api-client-react/   # Generated React Query hooks
  api-spec/           # OpenAPI spec (source of truth for API contracts)
  db/                  # Drizzle ORM schema and DB package
scripts/               # Workspace utility scripts
```

## Getting Started

### Prerequisites
- Node.js 24
- pnpm
- A PostgreSQL database

### Install

```bash
pnpm install
```

### Environment

Set the following environment variable before running the API server:

```
DATABASE_URL=<your-postgres-connection-string>
```

### Run

```bash
# Run the API server (port 5000)
pnpm --filter @workspace/api-server run dev

# Run the frontend
pnpm --filter @workspace/vortex-pro run dev
```

### Other useful commands

```bash
pnpm run typecheck                                   # typecheck all packages
pnpm run build                                        # typecheck + build all packages
pnpm --filter @workspace/api-spec run codegen          # regenerate API hooks + Zod schemas from OpenAPI spec
pnpm --filter @workspace/db run push                   # push DB schema changes (dev only)
```

## License

MIT

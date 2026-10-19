# Nods Control Center

One place to monitor and manage our scraping operations: runs, deliveries, tickets, blocked domains, proxies and team workload, on top of the master request database, Mozenda, Jira and Slack.

The clickable design reference lives in [`prototype/index.html`](prototype/index.html). Stack decisions are in [`docs/adr`](docs/adr).

## Structure

```
apps/
  web/        React + Vite frontend (TanStack Router/Query/Table, Tailwind, shadcn/ui)
  api/        NestJS API on Fastify (Swagger at /api/docs)
  worker/     NestJS worker: scheduled syncs from Mozenda, Jira, Slack (pg-boss jobs)
packages/
  shared/     Roles, statuses, business rules and zod schemas shared by web and api
  db/         Drizzle schema and migrations for our own Postgres
  sources/    Read-only clients for the master request DB, Mozenda, Jira, Slack
  tsconfig/   Shared TypeScript configs
prototype/    HTML prototype (mock data)
docs/adr/     Architecture decision records
```

## Getting started

Requirements: Node 22+, pnpm 12, Docker.

```bash
pnpm install
cp .env.example .env          # fill in what you have
pnpm db:up                    # local Postgres in Docker
pnpm db:migrate               # create our tables
pnpm dev                      # web on :5173, api on :3000, worker
```

Open http://localhost:5173. The API health check is at http://localhost:3000/api/health and the API docs at http://localhost:3000/api/docs.

## Scripts

| Command | What it does |
| --- | --- |
| `pnpm dev` | Runs web, api and worker in watch mode |
| `pnpm build` | Builds every package and app |
| `pnpm typecheck` | Type-checks everything |
| `pnpm test` | Runs tests |
| `pnpm lint` / `pnpm format` | Biome lint and format |
| `pnpm db:generate` | Creates a migration from schema changes |
| `pnpm db:migrate` | Applies migrations |

## Rules

- Never write to the source systems. Everything in `packages/sources` is read-only.
- Never commit credentials. Use `.env` (ignored by git).
- Brand and retail client data stay separate: every query is scoped by role and client segment.

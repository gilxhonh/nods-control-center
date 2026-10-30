# Nods Control Center: context for AI coding sessions

Read this first, then `docs/HANDOFF.md` (where the last session stopped) and `docs/tasks/` (what to do next).

## What this is
An internal web app that gives delivery engineers, delivery managers, CSMs and the Integration Team one place to see scraping operations: runs, coverage vs baseline, deliveries, tickets, blocked domains, proxies and workload. It sits on top of existing systems (master request DB, Mozenda, Jira, Slack) and replaces day-to-day lookups in NODS. The agreed UI is `prototype/index.html`.

## Hard rules
- **Never write to source systems.** Master request DB, Mozenda, Jira and Slack are read-only from this app unless a task explicitly says otherwise and the user approved it.
- **Never commit secrets.** Config comes from `.env` (see `.env.example`).
- **Brand and retail clients stay separate.** Every query that returns client data is scoped by role and client segment in the API, not only hidden in the UI.
- **Every write goes to the audit log** (`audit_log` table): who, what, when.
- Role names: delivery engineer, delivery manager, CSM, integration. Never "maintainer" or plain "manager".
- Keep diffs minimal and focused on the task. No drive-by refactors.

## Stack
pnpm 12 + Turborepo, Node 26 LTS, TypeScript 6 (not 7 until the Nest CLI supports it).
- `apps/api`: NestJS 12 on Fastify, zod validation via `ZodValidationPipe`, Swagger at `/api/docs`
- `apps/worker`: NestJS standalone app, `@nestjs/schedule` + pg-boss
- `apps/web`: React 19 + Vite, TanStack Router/Query/Table, Tailwind 4, shadcn/ui
- `packages/shared`: enums, business rules, zod schemas (single source of truth for types)
- `packages/db`: Drizzle schema + migrations (our own Postgres)
- `packages/sources`: read-only clients for external systems

## Commands
`pnpm dev` | `pnpm build` | `pnpm typecheck` | `pnpm test` | `pnpm lint` | `pnpm db:up` | `pnpm db:generate` | `pnpm db:migrate`

## Conventions
- Module layout follows `docs/modules.md`. One NestJS module per product area; the web app mirrors it under `apps/web/src/features/<module>`.
- Business rules (status, coverage, delivery projection) live in `packages/shared/src/rules` with unit tests, never inline in controllers or components.
- Schema change = edit `packages/db/src/schema.ts`, run `pnpm db:generate`, commit the migration.
- Branch per task from `develop`: `feat/NCC-012-domain-list`, PR back into `develop`. `main` only gets releases from `develop`; never commit to it directly. Commit messages say why, not just what.
- A task is done when its acceptance criteria pass, `pnpm lint build typecheck test` is green, and `docs/tasks` + `docs/HANDOFF.md` are updated.

## End of every session
`/start-task NCC-xxx` begins a task; `/finish-task` runs the steps below plus the `ncc-reviewer` agent and opens the PR into `develop`.
1. Tick finished tasks in `docs/tasks/*.md` (status column).
2. Rewrite the top of `docs/HANDOFF.md`: done, in progress, next, blockers, decisions.
3. Commit.

# Session handoff

Update the "Latest" section at the end of every session. Move the previous one into "History" (keep the last 5).

## Latest (2026-10-31)

**Done**
- RDIT-8: api logs are pino JSON through Fastify, Nest's `Logger` included (`apps/api/src/common/logging.ts`).
  Request ids: a valid `x-request-id` is reused, else a UUID; returned in the response header and tagged as
  `reqId` on every line logged during the request (AsyncLocalStorage). Secrets are redacted by key name. PR #6, merged.
- RDIT-2: api and worker validate env at startup with zod (`packages/shared/src/env.ts`, wired through
  `ConfigModule.forRoot({ validate })`). A missing or bad variable prints "Invalid environment:" with one
  line per variable and exits 1. Schemas only cover what each app reads today (api: `DATABASE_URL`,
  `API_PORT`, `WEB_ORIGIN`; worker: `DATABASE_URL`). The worker now refuses to start without a database.
- Claude Code tooling in `.claude/`: `ncc-reviewer` agent (read-only review against the hard rules), `start-task` and `finish-task` skills. `.claude/worktrees/` and `settings.local.json` are now ignored.
- `.gitattributes` checks out text files with LF, so `pnpm lint` passes on Windows. Existing checkouts: run
  `git rm -r --cached -q . && git reset --hard` once on a clean tree.
- Jira space `RDIT` holds the whole backlog: RDIT-1..47 are build tasks, RDIT-48..56 are decisions for Olsi
  (label `decision`). Summaries and descriptions use RDIT keys only. RDIT-1..12 (phase 0) are assigned to Gilxhon and
  in To Do; later tasks and the decisions sit in Backlog, unassigned.
- One ID convention: task IDs are the Jira keys in the repo, branches, commits and PRs. The old NCC-###/DEC-## IDs
  are gone (they only survive in older commit messages and PR titles).

**In progress**
- Nothing. Move RDIT-8 to Done in Jira (PR #6 merged).

**Next**
- Two-week plan, Mon 2 to Fri 13 Nov (deadline from Olsi): a working end-to-end slice, real retail Domains from
  `e3-delivery-data` behind a dev login. Day-by-day schedule and the decisions Olsi owns (RDIT-48..56) are in
  `docs/tasks/plan-2026-11-13.md`; work is tracked in Jira space `RDIT`.
- First on Mon 2 Nov: send the decision tasks to Olsi (assign RDIT-48..56 to him in Jira or raise them in person) and
  the access request (RDIT-13), then RDIT-6 (error filter).
- RDIT-6 can log through Nest's `Logger` and get `reqId` for free; consider returning the request id in the error body
  and adding `exposedHeaders: ['x-request-id']` to CORS so the web app can show it.

**Blockers / waiting on**
- Unchanged from 2026-10-19 below (source access, hosting, Entra ID app registration), now tracked as RDIT-49..51.

**Decisions**
- Nest's `abortOnError` is off in both `main.ts` files so startup errors exit with code 1, not `process.abort()`.
- `parseEnv` is tested from `apps/api/src/env.spec.ts` until RDIT-11 gives `packages/shared` its own Vitest.
- Logging uses Fastify's own pino plus a ~30-line Nest `LoggerService` adapter instead of `nestjs-pino` (no new dependency).
- Redaction is by exact key name (pino can't match case-insensitively or by pattern). New secret field names must be added to
  `SECRET_KEYS`, and secrets inside free-text messages (e.g. a connection string in an error message) are not caught.
- A fatal startup failure (before the logger is attached) still prints plain text and exits 1; everything after is JSON.
- Worker logging is unchanged (Nest console logger); give it pino when it does real work.
- **Status lives in Jira (`RDIT`), definitions in the repo.** Task IDs are the Jira keys.
  Claude Code does not read Jira; the skills tell the user which ticket to move. See ROADMAP "Working method".

## History

### 2026-10-19

**Done**
- Node 26 LTS (26.13.0): `.nvmrc`, `engines`, `@types/node` ^26.6.5, docs. Lint, build, typecheck and test pass on Node 26.
  Node 26 no longer bundles Corepack: run `npm install -g corepack && corepack enable` once.
- Monorepo scaffolded (web, api, worker, shared, db, sources), CI, Docker Postgres, ADR 0001.
- Dependencies on latest stable (2-day release-age buffer), Node 24 LTS.
- First migration (8 tables). `pnpm db:migrate` now prints the real error on failure.
- Roadmap, module map and task backlog written (`docs/ROADMAP.md`, `docs/modules.md`, `docs/tasks/`).

**In progress**
- Nothing.

**Next**
- Phase 0 tasks RDIT-1 to RDIT-10 (`docs/tasks/phase-0-foundations.md`).
- In parallel, ask IT for read-only access needed by Phase 1 (see Blockers).

**Blockers / waiting on**
- Read-only DB user for the master request database.
- Mozenda API key, Jira API token (OPS project), Slack bot token.
- Hosting target.
- Sign-in is Microsoft SSO (Entra ID), per the team. IT still has to confirm it and register the app
  (client ID, secret, tenant, redirect URL).

**Research**
- `docs/research/2026-10-30-org-segments-and-sources.md` — org chart, business lines, retail domain
  vocabulary, Jira project map and the hosting ticket (EDO-2313). It contradicts parts of
  `docs/modules.md`; read it before the segment/RBAC work.

- `docs/sources/e3-delivery-data.md` — schema of the e3-delivery Postgres (the master request DB),
  mapped to modules. Use it for the `createMasterRequestSource` TODO.

**Decisions**
- **Retail only for v1.** Managed Services and Brand clients exist in the same source systems but are
  out of scope; `business_line` is an unconditional filter, not a segment switcher. See `docs/modules.md`.
- No custom MCP server for project context for now: CLAUDE.md + this file + task files in the repo, GitHub Issues later. See ROADMAP "Working method".

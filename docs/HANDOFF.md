# Session handoff

Update the "Latest" section at the end of every session. Move the previous one into "History" (keep the last 5).

## Latest (2026-10-30)

**Done**
- NCC-001: api and worker validate env at startup with zod (`packages/shared/src/env.ts`, wired through
  `ConfigModule.forRoot({ validate })`). A missing or bad variable prints "Invalid environment:" with one
  line per variable and exits 1. Schemas only cover what each app reads today (api: `DATABASE_URL`,
  `API_PORT`, `WEB_ORIGIN`; worker: `DATABASE_URL`). The worker now refuses to start without a database.

**In progress**
- Nothing.

**Next**
- NCC-002 (logging), NCC-003 (error filter), NCC-004 (modules layout); see `docs/tasks/phase-0-foundations.md`.

**Blockers / waiting on**
- Unchanged from 2026-10-19 below (source access, hosting, Entra ID app registration).
- `pnpm lint` fails on Windows checkouts: biome flags CRLF line endings in ~60 files (`core.autocrlf=true`).
  Needs a `.gitattributes` (`* text=auto eol=lf`) or biome `lineEnding` setting; not done here.

**Decisions**
- Nest's `abortOnError` is off in both `main.ts` files so startup errors exit with code 1, not `process.abort()`.
- `parseEnv` is tested from `apps/api/src/env.spec.ts` until NCC-011 gives `packages/shared` its own Vitest.

## History

### 2026-10-19

**Done**
- Claude Code tooling in `.claude/`: `ncc-reviewer` agent (read-only review against the hard rules), `start-task` and `finish-task` skills. `.claude/worktrees/` and `settings.local.json` are now ignored.
- Node 26 LTS (26.13.0): `.nvmrc`, `engines`, `@types/node` ^26.6.5, docs. Lint, build, typecheck and test pass on Node 26.
  Node 26 no longer bundles Corepack: run `npm install -g corepack && corepack enable` once.
- Monorepo scaffolded (web, api, worker, shared, db, sources), CI, Docker Postgres, ADR 0001.
- Dependencies on latest stable (2-day release-age buffer), Node 24 LTS.
- First migration (8 tables). `pnpm db:migrate` now prints the real error on failure.
- Roadmap, module map and task backlog written (`docs/ROADMAP.md`, `docs/modules.md`, `docs/tasks/`).

**In progress**
- Nothing.

**Next**
- Phase 0 tasks NCC-001 to NCC-010 (`docs/tasks/phase-0-foundations.md`).
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

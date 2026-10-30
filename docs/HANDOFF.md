# Session handoff

Update the "Latest" section at the end of every session. Move the previous one into "History" (keep the last 5).

## Latest (2026-10-30)

**Done**
- NCC-001: api and worker validate env at startup with zod (`packages/shared/src/env.ts`, wired through
  `ConfigModule.forRoot({ validate })`). A missing or bad variable prints "Invalid environment:" with one
  line per variable and exits 1. Schemas only cover what each app reads today (api: `DATABASE_URL`,
  `API_PORT`, `WEB_ORIGIN`; worker: `DATABASE_URL`). The worker now refuses to start without a database.
- Claude Code tooling in `.claude/`: `ncc-reviewer` agent (read-only review against the hard rules), `start-task` and `finish-task` skills. `.claude/worktrees/` and `settings.local.json` are now ignored.
- `.gitattributes` checks out text files with LF, so `pnpm lint` passes on Windows. Existing checkouts: run
  `git rm -r --cached -q . && git reset --hard` once on a clean tree.
- Jira space `RDIT` holds the whole backlog: RDIT-1..47 are the 47 NCC tasks (key per task in the Jira column of
  `docs/tasks/*.md`), RDIT-48..56 are DEC-01..09. All unassigned; RDIT-2 (NCC-001) Done, RDIT-8 (NCC-002) In Progress.

**In progress**
- NCC-002 / RDIT-8: PR #6 open. Move RDIT-8 to Done when it merges.

**Next**
- Two-week plan, Mon 2 to Fri 13 Nov (deadline from Olsi): a working end-to-end slice, real retail Domains from
  `e3-delivery-data` behind a dev login. Day-by-day schedule and the decisions Olsi owns (DEC-01..09) are in
  `docs/tasks/plan-2026-11-13.md`; work is tracked in Jira space `RDIT`.

  First on Mon 2 Nov: send the DEC tasks to Olsi (they are unassigned; assign RDIT-48..56 to him in Jira or raise them
  in person), then NCC-003 / RDIT-6.

**Blockers / waiting on**
- Unchanged from 2026-10-19 below (source access, hosting, Entra ID app registration), now tracked as DEC-02..04.

**Decisions**
- Nest's `abortOnError` is off in both `main.ts` files so startup errors exit with code 1, not `process.abort()`.
- `parseEnv` is tested from `apps/api/src/env.spec.ts` until NCC-011 gives `packages/shared` its own Vitest.
- **Status lives in Jira (`RDIT`), definitions in the repo.** The task tables' Status column became a Jira column.
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

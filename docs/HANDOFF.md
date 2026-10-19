# Session handoff

Update the "Latest" section at the end of every session. Move the previous one into "History" (keep the last 5).

## Latest (2026-10-19)

**Done**
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
- Hosting target and SSO provider.

**Decisions**
- No custom MCP server for project context for now: CLAUDE.md + this file + task files in the repo, GitHub Issues later. See ROADMAP "Working method".

## History

# Roadmap

The goal of the first release is simple: a delivery engineer can stop opening NODS, Jira and Mozenda to answer "what do I need to look at today?". Everything else builds on that.

## Phases

| Phase | Outcome | Gate to move on |
|---|---|---|
| **0. Foundations** | Env validation, logging, errors, auth stub with roles, RBAC + segment guards, seed data, typed API client, app shell | CI green, a seeded user of each role can log in locally |
| **1. Source spikes** | Proven read-only access to master request DB, Mozenda, Jira, Slack; field mapping documented | Each source returns real data for one domain. **Biggest risk, start early** |
| **2. Clients, domains, assignments** | Real Clients, Domains and Domain detail (config card) from the master request DB | Matches NODS for a sample of 20 domains |
| **3. Runs, coverage, baselines** | Mozenda progress synced, coverage vs baseline, run statuses incl. blocked, Active Runs, Run detail, Overview KPIs | Status for live runs matches what engineers see in Mozenda |
| **4. Deliveries** | SLAs per client, projected finish, buffer, Deliveries page | Engineers trust the order and the at-risk flags for one week |
| **MVP pilot** | Phases 0 to 4 + My Domains, used by one pod alongside NODS | Pod uses it daily for 2 weeks |
| **5. Tickets** | Jira sync, links to domain/run, root causes, weekly report | Weekly report matches NODS report |
| **6. Writes** | Baseline changes (domain/store, with ticket), assignments, audit timeline | Delivery managers stop using NODS editors |
| **7. Blocks and proxies** | Blocked domains with recovery tracking, proxy usage and cost | |
| **8. NODS parity** | Weekly Requests, config/input changes, Store Coverage | NODS can be retired for read use |
| **9. Role views** | Team, CSM client views with impact summary, segment separation hardened | CSM pilot |
| **10. Alerts, analytics, explorer** | Alerts queue + Slack DMs, Analytics, read-only Data Explorer, Integrations health | |
| **11. Launch** | SSO, hosting, monitoring, backups, runbook | Go-live |
| **12. Later** | Write actions into Jira (create tickets from templates), MCP server over our own data | |

Phases 1 and 0 run in parallel: access requests take time, so ask on day one.

## Working method

### Source of truth for tasks
- **One ID convention: the Jira key** (`RDIT-##`) is the task ID in Jira, the task files, branches
  (`feat/RDIT-24-domain-list`), commits and PR titles (`RDIT-24: ...`).
- **Status lives in Jira**, space `RDIT` (Retail Dashboard For Integration Team). Labels `phase-N`, `module-<name>`,
  `size-S|M|L`, `blocked`, `plan-<date>`; decisions for Olsi are labelled `decision`. Created 2026-10-30 through Rovo,
  not by tools in this repo.
- **Definitions live in the repo**: `docs/tasks/phase-*.md` holds each task's module, size, dependencies and acceptance
  criteria. Change a task's scope here, its status in Jira.
- Claude Code does not read Jira (company policy is unconfirmed), so it learns status from the user and from HANDOFF.
  This replaces the earlier plan to move tasks to GitHub Issues.

### Context and session handoff
No custom MCP server is needed for this. The cheapest setup that works:
- `CLAUDE.md` at the repo root holds the stable context (rules, stack, conventions). Claude Code loads it automatically in every session.
- `docs/HANDOFF.md` holds the moving context (done, next, blockers, decisions), rewritten at the end of every session.
- ADRs in `docs/adr` record decisions with reasons, so nobody re-argues them.
- One branch and one PR per task; the PR description links the task ID.

When an MCP server does make sense:
- **GitHub MCP server** (existing, official): lets Claude read and update issues and PRs directly. Connect it once Issues are the source of truth. Nothing to build.
- **Our own MCP server (Phase 12)**: exposes Nods Control Center data (runs at risk, missing deliveries, blocked domains) so people can ask Claude about operations. This is a product feature, built on the same API.

### Definition of done
Acceptance criteria met, tests for any rule in `packages/shared`, `pnpm lint build typecheck test` green, migration committed if the schema changed, task status and HANDOFF updated.

### Sizes
S = up to half a day, M = 1 to 2 days, L = 3 to 5 days (split L tasks before starting).

# Phase 1: Source spikes

Goal: prove we can read every source, and write down exactly where each field comes from. Output of each spike is code in `packages/sources` plus a mapping doc in `docs/sources/<source>.md`.

| ID | Task | Module | Size | Depends on | Status |
|---|---|---|---|---|---|
| NCC-101 | Request access: read-only DB user, Mozenda API key, Jira token (OPS), Slack bot token | | S | | todo |
| NCC-102 | Master request DB: map tables for requests, config_ident, inputs, stores, client request IDs | sources | M | NCC-101 | blocked |
| NCC-103 | Mozenda: sequence status and item counts for one active run; rate limits; account list | sources | M | NCC-101 | blocked |
| NCC-104 | Jira: search OPS tickets by domain/run, custom fields for domain, run, coverage | sources | S | NCC-101 | blocked |
| NCC-105 | Slack: read channel history for `#ops-*`, map channel to client | sources | S | NCC-101 | blocked |
| NCC-106 | Find where baselines and thresholds live today (ticket generator config? DB?) | sources | S | NCC-102 | blocked |
| NCC-107 | Find where delivery deadlines (client SLAs) are defined today | sources | S | NCC-102 | blocked |
| NCC-108 | Decide per source: poll, webhook or both; write ADR 0002 (data ownership and sync) | docs | S | NCC-102..107 | todo |

## Acceptance criteria
- Each `docs/sources/*.md` lists: connection, tables or endpoints, every field we use and its meaning, refresh frequency, limits.
- A script `pnpm --filter @ncc/sources spike:<name>` prints real data for one domain without writing anything.

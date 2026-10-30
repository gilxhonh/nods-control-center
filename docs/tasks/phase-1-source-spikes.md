# Phase 1: Source spikes

Goal: prove we can read every source, and write down exactly where each field comes from. Output of each spike is code in `packages/sources` plus a mapping doc in `docs/sources/<source>.md`.

| ID | Task | Module | Size | Depends on |
|---|---|---|---|---|
| RDIT-13 | Request access: read-only DB user, Mozenda API key, Jira token (OPS), Slack bot token | | S | |
| RDIT-14 | Master request DB: map tables for requests, config_ident, inputs, stores, client request IDs | sources | M | RDIT-13 |
| RDIT-15 | Mozenda: sequence status and item counts for one active run; rate limits; account list | sources | M | RDIT-13 |
| RDIT-16 | Jira: search OPS tickets by domain/run, custom fields for domain, run, coverage | sources | S | RDIT-13 |
| RDIT-17 | Slack: read channel history for `#ops-*`, map channel to client | sources | S | RDIT-13 |
| RDIT-18 | Find where baselines and thresholds live today (ticket generator config? DB?) | sources | S | RDIT-14 |
| RDIT-19 | Find where delivery deadlines (client SLAs) are defined today | sources | S | RDIT-14 |
| RDIT-20 | Decide per source: poll, webhook or both; write ADR 0002 (data ownership and sync) | docs | S | RDIT-14..19 |

## Acceptance criteria
- Each `docs/sources/*.md` lists: connection, tables or endpoints, every field we use and its meaning, refresh frequency, limits.
- A script `pnpm --filter @ncc/sources spike:<name>` prints real data for one domain without writing anything.

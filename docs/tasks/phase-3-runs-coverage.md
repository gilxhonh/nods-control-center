# Phase 3: Runs, coverage, baselines

| ID | Task | Module | Size | Depends on | Jira |
|---|---|---|---|---|---|
| NCC-301 | Schema: run_snapshots (progress, captured, mozenda %, status), run_events (timeline) | db | S | NCC-103 | RDIT-30 |
| NCC-302 | Worker job `sync-mozenda` for active runs, with backoff and per-account rate limits | worker | L | NCC-301 | RDIT-31 |
| NCC-303 | Shared rules: run status incl. at risk (pace), delayed (stall), low count, blocked vs failed; unit tests | shared | M | | RDIT-32 |
| NCC-304 | Job `evaluate-runs`: apply rules after each sync, write status changes as run_events | worker | M | NCC-302, NCC-303 | RDIT-33 |
| NCC-305 | Baselines: current baseline per domain (and per store) read from source; store our changes in baseline_changes | baselines | M | NCC-106 | RDIT-34 |
| NCC-306 | `runs` module: active runs, run detail with timeline and category segments | api | M | NCC-304 | RDIT-35 |
| NCC-307 | Web: Active Runs table (status chips, progress, coverage meter with pace + threshold) | web | M | NCC-306 | RDIT-36 |
| NCC-308 | Web: Run detail (pipeline stages, event timeline, Mozenda progress) | web | M | NCC-306 | RDIT-37 |
| NCC-309 | Web: Overview KPIs, health strip, Attention required list | web | M | NCC-306 | RDIT-38 |
| NCC-310 | Web: Domain detail current run + historical runs chart | web | M | NCC-306 | RDIT-39 |

## Acceptance criteria
- For live runs, progress and captured counts are within one sync (2 min) of Mozenda.
- Status rules match the prototype definitions and are covered by tests for every status.

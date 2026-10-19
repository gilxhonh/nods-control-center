# Phase 3: Runs, coverage, baselines

| ID | Task | Module | Size | Depends on | Status |
|---|---|---|---|---|---|
| NCC-301 | Schema: run_snapshots (progress, captured, mozenda %, status), run_events (timeline) | db | S | NCC-103 | todo |
| NCC-302 | Worker job `sync-mozenda` for active runs, with backoff and per-account rate limits | worker | L | NCC-301 | todo |
| NCC-303 | Shared rules: run status incl. at risk (pace), delayed (stall), low count, blocked vs failed; unit tests | shared | M | | todo |
| NCC-304 | Job `evaluate-runs`: apply rules after each sync, write status changes as run_events | worker | M | NCC-302, NCC-303 | todo |
| NCC-305 | Baselines: current baseline per domain (and per store) read from source; store our changes in baseline_changes | baselines | M | NCC-106 | todo |
| NCC-306 | `runs` module: active runs, run detail with timeline and category segments | api | M | NCC-304 | todo |
| NCC-307 | Web: Active Runs table (status chips, progress, coverage meter with pace + threshold) | web | M | NCC-306 | todo |
| NCC-308 | Web: Run detail (pipeline stages, event timeline, Mozenda progress) | web | M | NCC-306 | todo |
| NCC-309 | Web: Overview KPIs, health strip, Attention required list | web | M | NCC-306 | todo |
| NCC-310 | Web: Domain detail current run + historical runs chart | web | M | NCC-306 | todo |

## Acceptance criteria
- For live runs, progress and captured counts are within one sync (2 min) of Mozenda.
- Status rules match the prototype definitions and are covered by tests for every status.

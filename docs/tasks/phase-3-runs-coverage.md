# Phase 3: Runs, coverage, baselines

| ID | Task | Module | Size | Depends on |
|---|---|---|---|---|
| RDIT-30 | Schema: run_snapshots (progress, captured, mozenda %, status), run_events (timeline) | db | S | RDIT-15 |
| RDIT-31 | Worker job `sync-mozenda` for active runs, with backoff and per-account rate limits | worker | L | RDIT-30 |
| RDIT-32 | Shared rules: run status incl. at risk (pace), delayed (stall), low count, blocked vs failed; unit tests | shared | M | |
| RDIT-33 | Job `evaluate-runs`: apply rules after each sync, write status changes as run_events | worker | M | RDIT-31, RDIT-32 |
| RDIT-34 | Baselines: current baseline per domain (and per store) read from source; store our changes in baseline_changes | baselines | M | RDIT-18 |
| RDIT-35 | `runs` module: active runs, run detail with timeline and category segments | api | M | RDIT-33 |
| RDIT-36 | Web: Active Runs table (status chips, progress, coverage meter with pace + threshold) | web | M | RDIT-35 |
| RDIT-37 | Web: Run detail (pipeline stages, event timeline, Mozenda progress) | web | M | RDIT-35 |
| RDIT-38 | Web: Overview KPIs, health strip, Attention required list | web | M | RDIT-35 |
| RDIT-39 | Web: Domain detail current run + historical runs chart | web | M | RDIT-35 |

## Acceptance criteria
- For live runs, progress and captured counts are within one sync (2 min) of Mozenda.
- Status rules match the prototype definitions and are covered by tests for every status.

# Phase 4: Deliveries and MVP pilot

| ID | Task | Module | Size | Depends on | Status |
|---|---|---|---|---|---|
| NCC-401 | Schema: client_slas (deadline rule per client/type, overrides per domain) | db | S | NCC-107 | todo |
| NCC-402 | Shared rules: deadline from SLA, projected finish (progress x avg duration), buffer, delivery status | shared | M | NCC-303 | todo |
| NCC-403 | Job `evaluate-deliveries`: create one delivery per domain per window, update status | worker | M | NCC-402, NCC-304 | todo |
| NCC-404 | Upload / client acknowledgement signal: find where delivery confirmation lives | sources | S | NCC-101 | todo |
| NCC-405 | `deliveries` module: list by due day, by engineer, delivery detail | api | M | NCC-403 | todo |
| NCC-406 | Web: Deliveries list (grouped by due day) and timeline view | web | L | NCC-405 | todo |
| NCC-407 | Web: My Domains with "my deliveries in deadline order" | web | M | NCC-405, NCC-206 | todo |
| NCC-408 | Pilot: deploy to an internal environment, onboard one pod, collect feedback in `docs/pilot-notes.md` | infra | M | all above | todo |

## Acceptance criteria
- Missing, at-risk and blocked deliveries match what the pod reports in Slack for one full week.
- A delivery engineer can answer "what do I need to look at today" from My Domains without opening NODS.

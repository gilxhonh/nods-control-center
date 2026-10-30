# Phase 4: Deliveries and MVP pilot

| ID | Task | Module | Size | Depends on | Jira |
|---|---|---|---|---|---|
| NCC-401 | Schema: client_slas (deadline rule per client/type, overrides per domain) | db | S | NCC-107 | RDIT-40 |
| NCC-402 | Shared rules: deadline from SLA, projected finish (progress x avg duration), buffer, delivery status | shared | M | NCC-303 | RDIT-41 |
| NCC-403 | Job `evaluate-deliveries`: create one delivery per domain per window, update status | worker | M | NCC-402, NCC-304 | RDIT-42 |
| NCC-404 | Upload / client acknowledgement signal: find where delivery confirmation lives | sources | S | NCC-101 | RDIT-43 |
| NCC-405 | `deliveries` module: list by due day, by engineer, delivery detail | api | M | NCC-403 | RDIT-44 |
| NCC-406 | Web: Deliveries list (grouped by due day) and timeline view | web | L | NCC-405 | RDIT-45 |
| NCC-407 | Web: My Domains with "my deliveries in deadline order" | web | M | NCC-405, NCC-206 | RDIT-46 |
| NCC-408 | Pilot: deploy to an internal environment, onboard one pod, collect feedback in `docs/pilot-notes.md` | infra | M | all above | RDIT-47 |

## Acceptance criteria
- Missing, at-risk and blocked deliveries match what the pod reports in Slack for one full week.
- A delivery engineer can answer "what do I need to look at today" from My Domains without opening NODS.

# Phase 4: Deliveries and MVP pilot

| ID | Task | Module | Size | Depends on |
|---|---|---|---|---|
| RDIT-40 | Schema: client_slas (deadline rule per client/type, overrides per domain) | db | S | RDIT-19 |
| RDIT-41 | Shared rules: deadline from SLA, projected finish (progress x avg duration), buffer, delivery status | shared | M | RDIT-32 |
| RDIT-42 | Job `evaluate-deliveries`: create one delivery per domain per window, update status | worker | M | RDIT-41, RDIT-33 |
| RDIT-43 | Upload / client acknowledgement signal: find where delivery confirmation lives | sources | S | RDIT-13 |
| RDIT-44 | `deliveries` module: list by due day, by engineer, delivery detail | api | M | RDIT-42 |
| RDIT-45 | Web: Deliveries list (grouped by due day) and timeline view | web | L | RDIT-44 |
| RDIT-46 | Web: My Domains with "my deliveries in deadline order" | web | M | RDIT-44, RDIT-26 |
| RDIT-47 | Pilot: deploy to an internal environment, onboard one pod, collect feedback in `docs/pilot-notes.md` | infra | M | all above |

## Acceptance criteria
- Missing, at-risk and blocked deliveries match what the pod reports in Slack for one full week.
- A delivery engineer can answer "what do I need to look at today" from My Domains without opening NODS.

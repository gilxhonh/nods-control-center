# Phase 2: Clients, domains, assignments

| ID | Task | Module | Size | Depends on | Jira |
|---|---|---|---|---|---|
| NCC-201 | Schema: add domain_config (banner ID, cadence, window, config_ident, bot IDs, Mozenda account, feasibility) | db | S | NCC-102 | RDIT-21 |
| NCC-202 | Worker job `sync-master-requests`: upsert clients (with segment), domains, config | worker | M | NCC-201 | RDIT-22 |
| NCC-203 | `clients` module: list + detail endpoints, scoped by role/segment | api | M | NCC-006, NCC-202 | RDIT-23 |
| NCC-204 | `domains` module: list with filters (client, engineer, type, window), detail endpoint | api | M | NCC-006, NCC-202 | RDIT-24 |
| NCC-205 | `assignments` module: current owner + history; import current assignees from NODS export | api | M | NCC-204 | RDIT-25 |
| NCC-206 | Web: Domains page (table, filters, search) per prototype | web | M | NCC-204, NCC-010 | RDIT-26 |
| NCC-207 | Web: Domain detail header, metadata strip, crawl configuration card | web | M | NCC-204 | RDIT-27 |
| NCC-208 | Web: Clients list and Client detail (domains table, health placeholder) | web | M | NCC-203 | RDIT-28 |
| NCC-209 | Global search (domain, client, config ident, banner ID) | api, web | S | NCC-204 | RDIT-29 |

## Acceptance criteria
- For 20 sample domains, banner ID, window, cadence, type, assignee and config ident match NODS.
- Sync job is idempotent and records each run in `sync_runs` (start, end, rows, errors).

# Phase 2: Clients, domains, assignments

| ID | Task | Module | Size | Depends on |
|---|---|---|---|---|
| RDIT-21 | Schema: add domain_config (banner ID, cadence, window, config_ident, bot IDs, Mozenda account, feasibility) | db | S | RDIT-14 |
| RDIT-22 | Worker job `sync-master-requests`: upsert clients (with segment), domains, config | worker | M | RDIT-21 |
| RDIT-23 | `clients` module: list + detail endpoints, scoped by role/segment | api | M | RDIT-7, RDIT-22 |
| RDIT-24 | `domains` module: list with filters (client, engineer, type, window), detail endpoint | api | M | RDIT-7, RDIT-22 |
| RDIT-25 | `assignments` module: current owner + history; import current assignees from NODS export | api | M | RDIT-24 |
| RDIT-26 | Web: Domains page (table, filters, search) per prototype | web | M | RDIT-24, RDIT-9 |
| RDIT-27 | Web: Domain detail header, metadata strip, crawl configuration card | web | M | RDIT-24 |
| RDIT-28 | Web: Clients list and Client detail (domains table, health placeholder) | web | M | RDIT-23 |
| RDIT-29 | Global search (domain, client, config ident, banner ID) | api, web | S | RDIT-24 |

## Acceptance criteria
- For 20 sample domains, banner ID, window, cadence, type, assignee and config ident match NODS.
- Sync job is idempotent and records each run in `sync_runs` (start, end, rows, errors).

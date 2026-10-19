# Phase 2: Clients, domains, assignments

| ID | Task | Module | Size | Depends on | Status |
|---|---|---|---|---|---|
| NCC-201 | Schema: add domain_config (banner ID, cadence, window, config_ident, bot IDs, Mozenda account, feasibility) | db | S | NCC-102 | todo |
| NCC-202 | Worker job `sync-master-requests`: upsert clients (with segment), domains, config | worker | M | NCC-201 | todo |
| NCC-203 | `clients` module: list + detail endpoints, scoped by role/segment | api | M | NCC-006, NCC-202 | todo |
| NCC-204 | `domains` module: list with filters (client, engineer, type, window), detail endpoint | api | M | NCC-006, NCC-202 | todo |
| NCC-205 | `assignments` module: current owner + history; import current assignees from NODS export | api | M | NCC-204 | todo |
| NCC-206 | Web: Domains page (table, filters, search) per prototype | web | M | NCC-204, NCC-010 | todo |
| NCC-207 | Web: Domain detail header, metadata strip, crawl configuration card | web | M | NCC-204 | todo |
| NCC-208 | Web: Clients list and Client detail (domains table, health placeholder) | web | M | NCC-203 | todo |
| NCC-209 | Global search (domain, client, config ident, banner ID) | api, web | S | NCC-204 | todo |

## Acceptance criteria
- For 20 sample domains, banner ID, window, cadence, type, assignee and config ident match NODS.
- Sync job is idempotent and records each run in `sync_runs` (start, end, rows, errors).

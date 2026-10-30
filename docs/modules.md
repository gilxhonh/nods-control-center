# Modules

Each product area is one NestJS module in `apps/api/src/modules/<name>`, one folder in `apps/web/src/features/<name>`, and owns its tables in `packages/db`. Modules talk to each other through their exported services, never by querying another module's tables.

Revised 2026-10-30 from `docs/research/2026-10-30-org-segments-and-sources.md`. The remaining open questions in that doc's section 8 are not settled here.

**Scope: retail only.** v1 serves the Retail business line. The source systems also hold Managed Services and Brand clients (see the research doc), so `business_line` exists to **filter those out at the API and DB boundary**, not to switch between them. No Brand or Managed Services screens, metrics or deliverables are in scope.

| Module | Owns (tables) | Reads from | Main screens | Phase |
|---|---|---|---|---|
| `auth` | sessions | SSO (OIDC) | Login | 0, 11 |
| `users` | users, teams | | Team, Settings | 0 |
| `clients` | clients (business_line, v1 filters to `retail`) | source systems | Clients, Client detail | 2 |
| `domains` | domains, domain_config | source systems, NODS config | Domains, Domain detail | 2 |
| `assignments` | domain_assignments | | Assignments | 2, 6 |
| `runs` | run_snapshots, run_events | Mozenda, source systems | Active Runs, Run History, Run detail | 3 |
| `baselines` | baseline_changes, store_baselines | | Baseline card, modal | 3, 6 |
| `deliveries` | deliveries, client_slas | runs | Deliveries | 4 |
| `tickets` | ticket_snapshots (+ project_key), ticket_links | Jira (configurable project keys) | Tickets, Weekly report | 5 |
| `blocks` | domain_blocks | | Blocked card, banners | 7 |
| `proxies` | proxy_usage_daily | proxy provider APIs | Proxies | 7 |
| `stores` | store_coverage_daily | source systems | Store Coverage | 8 |
| `requests` | (read model) | source systems | Weekly Requests | 8 |
| `alerts` | alerts, alert_acks | all modules (events) | Alerts, notifications | 10 |
| `analytics` | (read model) | all modules | Analytics | 10 |
| `explorer` | saved_queries | read-only DB role | Data Explorer | 10 |
| `integrations` | sync_runs | worker | Integrations | 1, 10 |
| `audit` | audit_log | all writes | Activity timelines | 0 |
| `slack` | slack_message_cache | Slack | Slack activity cards | 5 |

## Source systems
"Source systems" is three read-only stores, not one. Per EDO-2313 the app's VM is granted reach to:
- **Store Postgres** — `storedb.produs.e3internal.com`
- **e3-delivery** Postgres — `e3-delivery-data`
- **Snowflake** — holds the crawl requests (`MISSION.ONLINE_CRAWL_REQUESTS(from, to)`: `request_name`, `banner_name`, `crawl_type`, `crawl_frequency`, `crawl_start_utc`, `delivery_utc`, `client_id`, `order_active`) and linking (`link.links_family`).

Which of the three is "the master request DB" in `CLAUDE.md` is still open. **NODS is network-restricted** (403 from outside the corporate network), so agent-owner data needs the VM or VPN.

The business hierarchy is **client → banner → store set / product set**, not client → domain. Banner is the business unit, domain is the crawl unit; the `clients` and `domains` modules need both and a mapping between them.

## Jira projects for `tickets`
There is no `OPS` project. The sync reads a configured set of keys, and each ticket keeps its `project_key`:
`WDC` (web data collection delivery), `DTT` (integration team, feasibility), `E3BI` (banner implementation), `EDO` (devops), `DEL` / `DRI` (delivery), `SI` / `CS` / `FC` / `SS` (support, by vertical), `RDI` (reporting and data issues), `TDP` (datamart pipeline), `CPL` / `ML` (linking and find-rate), `BOPS` (brand).
Crawl pods have their own projects, which is how a run maps to a team: `SK`, `SOTT`, `DHT`, `CST`, `MAD`.

## Worker jobs (`apps/worker/src/jobs`)
| Job | Schedule | Writes |
|---|---|---|
| `sync-master-requests` | every 10 min | clients, domains, domain_config, store lists |
| `sync-mozenda` | every 2 min for active runs | run_snapshots, run_events |
| `sync-jira` | every 1 min (webhook later) | ticket_snapshots |
| `sync-slack` | Events API | slack_message_cache |
| `sync-proxies` | hourly | proxy_usage_daily |
| `evaluate-runs` | after each Mozenda sync | run status, alerts |
| `evaluate-deliveries` | every 5 min | delivery status, alerts |

## Shared rules (`packages/shared/src/rules`)
Run status, coverage, delivery projection and buffer, at-risk pace, blocked vs failed, workload score. Pure functions with unit tests, used by worker and web alike.
- Delivery projection compares against `delivery_utc` from the Snowflake crawl request — that is the contractual expected completion, not an estimate of ours.
- **Late client input is its own at-risk cause**, separate from crawl failure. Clients send Product, Store, Price, Sales and Product Attributes files on a cadence; late input is a known cause of missed deliveries and must not be reported as a crawl problem.
- Retail coverage is two-dimensional (stores x products). Match rate ("find-rate") is a retail metric, not a brand-only one.

## Access rules
Two axes: **role** decides what you can do, **business line** decides what you can see. They are independent.
- Delivery engineer: own domains by default, can view team; can request baseline changes.
- Tech lead: a delivery engineer who sees the whole pod. (Real rung in the org; decide whether it is its own role or a flag.)
- Delivery manager: their pod; can assign, change baselines, manage blocks and proxy pools.
- CSM: only their clients, client-facing fields; no Data Explorer, no assignments.
- Integration: everything, including integrations and Data Explorer.
- Data for different business lines never mixes in one response unless the user has access to more than one. In v1 that filter is unconditional: only `retail` clients are ever returned.

Scoping follows the real org, not the segment:
- **Delivery engineers and managers are cross-business-line.** Data Strategy is split into four collection pods plus one integration pod, by manager, with no segment in any title. Scope them by pod and domain assignment, never by business line.
- **CSM scope is a book of business, not a segment.** No CSM title carries a business line, so enforce on a `csm_clients(user_id, client_id)` assignment and derive the visible business lines from the clients they hold.
- Postgres row-level security filters on `client_id`, so a UI bug cannot leak data. The API takes the scope from the session, never from a request parameter.

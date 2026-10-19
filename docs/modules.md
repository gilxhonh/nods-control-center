# Modules

Each product area is one NestJS module in `apps/api/src/modules/<name>`, one folder in `apps/web/src/features/<name>`, and owns its tables in `packages/db`. Modules talk to each other through their exported services, never by querying another module's tables.

| Module | Owns (tables) | Reads from | Main screens | Phase |
|---|---|---|---|---|
| `auth` | sessions | SSO (OIDC) | Login | 0, 11 |
| `users` | users, teams | | Team, Settings | 0 |
| `clients` | clients (segment: brand / retail) | master request DB | Clients, Client detail | 2 |
| `domains` | domains, domain_config | master request DB, NODS config | Domains, Domain detail | 2 |
| `assignments` | domain_assignments | | Assignments | 2, 6 |
| `runs` | run_snapshots, run_events | Mozenda, master request DB | Active Runs, Run History, Run detail | 3 |
| `baselines` | baseline_changes, store_baselines | | Baseline card, modal | 3, 6 |
| `deliveries` | deliveries, client_slas | runs | Deliveries | 4 |
| `tickets` | ticket_snapshots, ticket_links | Jira | Tickets, Weekly report | 5 |
| `blocks` | domain_blocks | | Blocked card, banners | 7 |
| `proxies` | proxy_usage_daily | proxy provider APIs | Proxies | 7 |
| `stores` | store_coverage_daily | master request DB | Store Coverage | 8 |
| `requests` | (read model) | master request DB | Weekly Requests | 8 |
| `alerts` | alerts, alert_acks | all modules (events) | Alerts, notifications | 10 |
| `analytics` | (read model) | all modules | Analytics | 10 |
| `explorer` | saved_queries | read-only DB role | Data Explorer | 10 |
| `integrations` | sync_runs | worker | Integrations | 1, 10 |
| `audit` | audit_log | all writes | Activity timelines | 0 |
| `slack` | slack_message_cache | Slack | Slack activity cards | 5 |

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

## Access rules
- Delivery engineer: own domains by default, can view team; can request baseline changes.
- Delivery manager: their team; can assign, change baselines, manage blocks and proxy pools.
- CSM: only their clients, client-facing fields; no Data Explorer, no assignments.
- Integration: everything, including integrations and Data Explorer.
- Brand and retail data never mix in one response unless the user has access to both.

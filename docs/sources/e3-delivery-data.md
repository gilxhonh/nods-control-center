# Source: `e3-delivery-data` Postgres

Read-only source. This is the "master request DB" in `CLAUDE.md`. Schema taken from a schema-only
`pg_dump` (Cloud SQL, Postgres 12.22) on 2026-10-30. Only the `public` schema was dumped; the
`audit_retail_request` schema (owner of the `crawl_baseline` audit trigger) is referenced but not included.

A read-only role `grafanareader` already exists with `SELECT` on every table. Ask IT whether we can reuse it
or get our own.

## Quirks to handle in `packages/sources`
- Column names are mixed case and quoted (`"BannerID"`, `"5 AM PST Delivery"`, `"API Calls"`). Quote everything.
- Almost everything is `text` / `varchar`, including numbers and booleans (`"Built"`, `weeknum`, `"Latitude"`).
  Parse and validate with zod at the source boundary.
- The same week appears as both `weeknum` (text) and `week_num` (integer) in several tables. Prefer `week_num` + `year`.
- `"BannerID"` is `integer` in `config_db`, `weekly_request`, `weekly_request_changes`; `text` elsewhere.
- No foreign keys. Joins are by convention on `config_ident`, `"BannerID"`, `"BaseURL"`, `"Engage3StoreID"`, `week_num` + `year`.
- **Never select these columns:** `"user".password`, `voila_logins.password`, `proxy_info."Password"`, `proxy_info."Username"`.
  Name columns explicitly, no `select *`.

## Tables and what they feed

| Table | What it is | Key / index | Feeds module |
|---|---|---|---|
| `raw_request` | Client crawl requests as received (`PS_CLIENT_REQUEST_ID`, `CLIENT_ID/NAME`, banner, store, `CRAWL_FREQUENCY`, `CRAWL_METHOD(_TYPE)`, `CRAWL_START_UTC`, `DELIVERY_UTC`, `ORDER_ACTIVE`, `Country`, `year`, `week_num`) | none | clients, deliveries |
| `master_request` | One row per store per config per week: banner, store, address, `Window`, `Length`, `Cadence`, `Type`, `config_ident`, bot config ids, `Platform`, `Assignee`, `inputNr`, `rphd_counts`, `diff_counts`, `low_count_ticket`, `missing_store_ticket`, `ticket_root_cause`, `ticket_sub_cause`, `"Consistency"` jsonb, `CLIENT_NAME`, `PS_CLIENT_REQUEST_ID` | `row_id`; idx (`year`, `week_num`, `config_ident`, `"Engage3StoreID"`) | domains, coverage, tickets |
| `weekly_request` | One row per config per week: `Batch`, `"BannerID"`, `"BaseURL"`, `Window`, `Cadence`, `Type`, `config_ident`, bot config ids, `Platform`, `Assignee`, `inputPresent`, `inputNr`, `rphd_stores`, `rphd_counts`, tickets, `input_collection_id`, `sequence_id`, `CLIENT_NAME`, `PS_CLIENT_REQUEST_ID`, `CRAWL_START_UTC`, `DELIVERY_UTC`, `csm` | `row_id`; idx (`config_ident`, `week_num`, `year`), (`year`, `week_num`) | domains, deliveries, workload |
| `weekly_request_changes` | Configs added/removed between two weeks (`added_removed`, `status`, `week_compare`, `compare_year/week_x/y`) | `row_id`; idx on compare cols, `config_ident`, `week_compare` | domains (change history) |
| `config_db` | Bot configuration per config: `"BannerID"`, `"BaseURL"`, `Window`, `Cadence`, `Type`, `config_ident`, `input_collection_id`, `first_bot_config_ID`, `pdp_bot_config_id`, `Built`, `Platform`, `API Calls`, `Assignee`, `Note`, `StopAt`, `ParseDirectedInputs`, `sequence_id` | `row_id` | domains (domain_config) |
| `crawl_baseline` | Baseline count per banner + store, with `ticketID`; audited by trigger | unique (`"BannerID"`, `"Engage3StoreID"`) | coverage (baseline) |
| `low_counts` | `master_request`-shaped rows under baseline, with `low_count_ticket` | none | coverage, tickets |
| `missing_stores` | `master_request`-shaped rows with no data, with `missing_store_ticket` | none | coverage, tickets |
| `retail_consistency` | Per banner/store/config/week field fill rates (`*_ROWS`, `*_PCT` for SKU, UPC, prices, promo, loyalty, categories...), non-unique SKU/UPC, `consistency_deltas` jsonb, `consistency_ticket` | none (all `NOT NULL`) | coverage (data quality) |
| `domain_feasibility` | Per banner/URL: fullbook/directed/category feasible + built flags, `MaxFullbookStore3Day`, `blocked`, `build_ticket`, `Note` | `row_id` | domains, blocked domains |
| `user_crawl_requests_view` | Run status per config/week: `Status`, `Error_message`, `Trigger_to_S3`, `PresentS3`, `delivered`, `last_checked`, `input_store_nr`, `input_URL_nr`, `low_conts`, `snowflake_counts`, `missing_stores`, `ticket_url`, `s3_input_file_path` (a table despite the name) | `id` | runs, deliveries |
| `cleaned_requests` | Older `master_request`-shaped table (`standard_nonstandard`, `is_5_AM_PST_Delivery`) | `id` | probably legacy, confirm |
| `site_store_codes` | Site's own store code per banner/store (`site_store_code`, `URLL`) | `id` | domains (store lists) |
| `assignees` | `"BaseURL"` → `"Assignee"` | `row_id` | workload |
| `retail_csm` | `client` → `csm` (names, not ids) | none | access (csm_clients seed) |
| `web_data_crawl_groups` | `team_manager` → `team_member` (`team_member_full_name` unique) | unique name | access (pods), workload |
| `web_data_crawl_second_shift` | Same shape, second-shift team | `id` | workload |
| `"user"` | NODS users: `username`, `role`, `slack_id`, `jira_id` (+ `password`, do not read) | `id`; unique `username` | users (Slack/Jira id mapping) |
| `proxy_info` | Proxy zones: name, `Limit`, `Proposed Limit`, `Geolocation`, `Server`, `Port`, `dexi_pool_name`, `Platform`, `Account`, `Provider` (+ credentials, do not read) | none | proxies |
| `voila_logins` | Site login accounts per store (+ `password`, do not read) | none | out of scope |

## Open questions
- Which of `master_request` / `weekly_request` / `user_crawl_requests_view` is the live current-week view vs history?
- Is `cleaned_requests` still written to?
- Names (`Assignee`, `csm`, `team_member`) are free text. What maps them to our `users` (email)? `"user".username` + `slack_id`/`jira_id` is the best candidate.
- Business line / segment is not a column anywhere. Retail-only scoping has to come from `CLIENT_NAME` / `retail_*` tables or from Snowflake `client_id`.

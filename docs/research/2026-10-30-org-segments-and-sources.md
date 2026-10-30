# Research: org, segments, domain vocabulary and hosting

Date: 2026-10-30. Method: read-only browsing of the BambooHR directory, Confluence space `DC`
(Data Strategy) and Jira (`mozenda.atlassian.net`), signed in as Gilxhon Hima. Nothing was written
to any source system.

Purpose: answer the open questions in the draft user/segment model before it becomes an architecture
doc. **Read this together with `docs/modules.md` — several things there need revising.**

No personal contact details (email, phone) were copied into this file; only names, job titles and
reporting lines, which are what the access model depends on.

---

## 1. Headline: the two-segment model is wrong as drawn

The draft assumed two segments, Retail and Brands. The evidence says there are **three business
lines**, and they are not peers:

| Line | Evidence | Maturity |
|---|---|---|
| **Retail** (price / competitive intelligence) | Confluence folder `Engage3 - Retail`: ~20 pages, per-client Program Briefs (Meijer, Superior Grocers, Chedraui / Smart & Final, Walmart, Sobeys, Loblaw, Big W, QuikTrip, Sheetz, Interstate Batteries...), a maintained template, a reporting schema, T1/T4 tiers | Mature — this is the core business |
| **Managed Services** (custom web data collection, any client, any site) | Confluence folder `Managed Services - Client Documentation`: ~40 clients — Hershey's, Ralph Lauren, Samsung, L'Oreal, Bose, Disney, Mattel, Caterpillar, Vodafone, McKinsey, Ancestry, Lex Machina, Courtroom Insight, Domino's, Artnet, Chadwell Supply... | Mature, Mozenda/Dexi heritage, large and long-running (pages up to 4 years old) |
| **Brand** | Confluence folder `Engage3 - Brand Skunkworks`: **one** page, ~1 month old. Jira `BOPS` (BrandOps) and `SS` (SelfServedBrands - Support) exist | Early / exploratory — the folder is literally named "Skunkworks" |

**Consequence for the design.** A `segment` enum of `brand | retail` (as in `docs/modules.md`:
`clients (segment: brand / retail)`) does not cover the Managed Services clients, which are probably
the majority of distinct client records and certainly the majority of distinct domains. The second
axis is better named **business line** or **program type**, with at least `retail`,
`managed_services`, `brand`, and the schema should allow a fourth without a migration.

Also: Brand is too small today to justify building "SKU Coverage" and "Retailer Matrix" screens in the
first releases. The hosting ticket (section 5) calls the thing being built "a retail dashboard".

### What Brand actually is, concretely

The single Brand Skunkworks page, `Retail Product Data Collection`, is a **product-catalogue crawl
spec with no price and no store**: `banner_id`, `banner_product_id`, `banner_parent_id`,
`product_url`, `sku`, `gtin`, `mpn`, `product_name`, `brand`, `manufacturer`, `long_description`,
`category_l1...ln`, `primary_image_url`, `size_text`, `pack_count`, `unit_net_content` + `_uom`,
`package_type`, `color`, `flavor`, `scent`, `material`, `extra_metadata`, `crawl_datetime`.

So the draft's guess ("Brands = SKU match rate, MAP violations, sellers") is **not** what Brand is here
today. Today Brand = catalogue / attribute completeness, keyed on `banner_id` + `banner_product_id`.
MAP and seller monitoring appear nowhere in the evidence. Do not build screens on that assumption.

### Corrections to the draft's "what differs per segment" table

- "Retail = stores, Brands = SKUs" is wrong. **Retail programs have both store sets and product sets**,
  both identified by UUID, and the retail side already has a product-matching metric of its own
  (**find-rate**, see section 3). Retail coverage is two-dimensional: stores x products.
- "Match rate" is therefore not a Brand-only concept. It is a first-class retail metric.

---

## 2. Org: who the roles actually are

Source: BambooHR directory, 238 records parsed. Departments: Operations, Engineering (Development),
Customer Value, G&A, Product, Sales.

### Operations head count by team

```
Data Strategy                           45    <- web crawl delivery; this app's primary users
Customer Operations                     34    <- product linking + data integrity
Customer Solutions                       8
In-Store Data                            6
Call Center                              5
Retail Support                           4
Center of Excellence                     4
Customer Value / Success                 5
Solutions Engineering (EMEA, Linking)    2
Delivery, Data Operations, Support       3
```

### Data Strategy — the "delivery engineer" org (45 people)

```
Candace Simpson (SVP, Customer Operations)
└── Olsi Mahmutaj — Director, Digital Data Strategy
    ├── Edison Damjani — Senior Manager, Web Data Collection
    │   ├── Tea Grenazi   — Manager, Web Data Collection   (7)
    │   ├── Genti Halilaj — Manager, Web Data Collection   (7)
    │   ├── Lediana Omeri — Manager, Web Data Collection   (9)
    │   └── Kevin Lico    — Manager, Web Data Collection  (10)
    └── Santjago Ulndreaj — Manager, Web Data Integration  (5)   <- the "Integration Team"
```

Each collection pod has a **Tech Lead, Web Data Collection** plus Engineers / Associate Engineers.
The Integration pod (where Gilxhon Hima sits) has a Tech Lead, Web Data Integration plus Engineers and
Associate Engineers, Web Data Integration.

**Finding: the delivery org is NOT split by segment.** It is split into four collection pods by
manager, plus one integration pod. Nobody in Data Strategy has "Retail" or "Brand" in their title. So
delivery engineers and delivery managers work **across** business lines.

Role-name mapping for `docs/modules.md`:

| App role | Real titles |
|---|---|
| delivery engineer | Associate Engineer / Engineer / Senior Engineer, Web Data Collection; Tech Lead, Web Data Collection |
| delivery manager | Manager / Senior Manager, Web Data Collection; Director, Digital Data Strategy |
| integration | Associate Engineer / Engineer / Tech Lead, Web Data **Integration**; Manager, Web Data Integration |
| CSM | Customer Success Manager / Sr. Customer Success Manager (Customer Value dept) |

Note the real org has a **Tech Lead** rung between engineer and manager that the current role list does
not model. Worth deciding whether Tech Lead is its own role or a delivery engineer with team-view
permission.

### Customer Solutions — the one place the Retail/Brand split IS organisational

```
Klodiana Halilaj — Director, Customer Solutions
├── Espera Hysa — Customer Solutions Team Lead, RETAIL
│   └── Customer Solution(s) Associate / Specialist, Retail  (4, team "Retail Support")
├── Tea Myftiu  — Customer Solutions Team Lead, BRAND
│   └── Customer Solutions Associate, Brand  (2)
└── Bekim Brahaj — Customer Solutions Specialist, Mobile & Fuel
```

This is the only team whose job titles carry the segment. It is small (8 people) and the Retail side is
roughly 2.5x the Brand side. **Fuel is a third vertical here**, with its own Jira project (`FC`) and
its own Confluence pages — another sign that `brand | retail` is too narrow.

### Customer Success / CSMs — not segmented by title

```
Derek Lott (SVP Customer Value Transformation)
└── Rebecca Matthews — Global VP of Customer Success
    ├── Huma Khan       — Global VP of Customer Success (Albania-based CSMs)
    ├── Colin Sernick   — Sr. Director, Customer Success
    ├── Adrienne Visher — Director, Customer Success
    ├── Anna Kozerawski — VP, Customer Success, EMEA
    ├── Mel Lewis       — Director, Customer Success
    └── Chris Hiner     — VP, Customer Success
```

No CSM title mentions Retail or Brand. **CSM scope is a book of business, not an org property** — so in
the app, a CSM's visibility must come from a client-assignment table, not from a segment flag alone.

### Other Operations teams the app will touch

- **Customer Operations (34)** under Shelby Bult → Elisa Pashku (Product Linking Manager), with team
  leads Megi Kushta, Afrodhiti Sino, Ajna Shala, Flaura Qosja; plus Lauren Andrews (Senior Manager)
  with Magi Asllani (Data Integrity Team Lead) and Elda Nela (Database Management Team Lead).
  **Product Linking Analysts are a large user population** not currently in the role list.
- **In-Store Data (6)** under Helena Cisneros (GVP, Store Operations and Intelligence) → Matt De La
  Torre (Director, Product Acquisition) — physical store collection.
- **Call Center (5)** under Renee Abangan — phone price collection.
  → In-Store and Call Center mean **web crawling is only one of three acquisition channels**. The
  Program Brief's `Channel` field is `Online / In-Store / Both`. A "run" in this app is a *web* run;
  coverage vs baseline for a client may legitimately be fed by non-web channels too.
- **Center of Excellence / Global Implementation** under Kaley Hansbrough (Jordyn Fahey, Jake Hammond)
  — these are the people who author the Program Briefs, i.e. the owners of client configuration.

### Engineering teams that own the systems we read from

Mozenda Engineering (Chris Curtis, Brian Anderson), Advanced Web Data Collection Team, Dev Ops
(Xhenisa Ibro), Data Engineering (John Butler, Matthew Belo), Client ETL, PIM Science, Data Science.
Hosting and infrastructure asks go to Brian Anderson's org.

---

## 3. Domain vocabulary, from the Retail Program Brief template

Source: `A TEMPLATE Retail Program Brief` (author Kaley Hansbrough), described in-page as the single
source of truth for a retail program. This is the richest schema input found and should drive
`packages/shared`.

**Program / client level**
`Client Name`, `Contract Start Date`, `Contract Renewal Date`, `Primary Region / Market`,
`Program Tier` (**T1 / T4 / PIA**), `Active Banners`, `Contracted SKU Volume`,
`Data Delivery Format` (Snowflake Share / SFTP / OneDrive / API).
Named program roles: **Retail Solutions Architect**, **Implementation Lead**, **CSM**.

**Scope**
`Retailer / Competitor` → `Banner Name` → `Country / Market`, `Channel` (Online / In-Store / Both),
`Store Count`, **`Store Set (UUID)`**, `In Contract?`.
The hierarchy is **client → banner → store set / product set**, not client → domain. "Banner" is the
unit the business talks in; "domain" is the crawl-side unit. The app needs both, and a mapping.

**Crawl layer** — fields come from a Snowflake table function `MISSION.ONLINE_CRAWL_REQUESTS(from, to)`:
`request_name`, `banner_name`, `crawl_method` + `crawl_method_type` → `crawl_type`
(Online / In-Store / **Directed**), `crawl_start_dow`, `delivery_dow`, `crawl_frequency`,
`crawl_same_day`, `crawl_start_utc`, `delivery_utc`, `client_id`, `order_active`, **Agent Owner**.

→ This is almost exactly the "Weekly Requests" screen. The crawl-request data is reachable as a
Snowflake table function keyed by `client_id`, and **`delivery_utc` is the contractual expected
completion** — that is what delivery projection and at-risk flags should compare against.
Agent ownership lives in NODS at `https://wdcintegration.mozenda.com/nods/public_assignees`
(**403 from outside the network** — see section 5).

**Client inputs** — things the client sends us, which can block a delivery.
Input types: Product, Store, Price, Sales, Product Attributes. Each has a file name/pattern, cadence
(e.g. "daily before 04:00 GMT"), delivery location (Azure SFTP), ETL platform and status
(Automated / Ad Hoc / N/A). Archive path pattern `filepipeline/processed/{pipeline_name}/{UUID}/`.

→ **Late client input is a named failure mode** in the template ("late data delivery has previously
caused high rates of synthetic data, leading to missing promo/loyalty fields"). The app should model it
as its own at-risk cause; it is not a crawl failure.

**Linking / matching**
- `Exact Match`: UPC to UPC, exact variant to exact variant.
- `Good Link`: +/-10% size variance; PL to PL, National Brand A to National Brand A; unbranded items may
  link to any competitor PL; all relevant attributes match; family variance (colour/flavour/scent) allowed.
- `Fair Match`: between +/-10% and +/-20% size variance, same brand rules.
- **Private Label (PL) tiering** per client.
- **Lighthouse projects** plus an **ML linking** schedule; `pswap_project_id`, table `link.links_family`,
  keyed by `client_id`.
- **Find-Rate** — tracked for stability, root causes and historical trend. This is the retail match-rate
  metric. Owned by Customer Operations (Product Linking), not by Data Strategy.

**Downstream**
`DataMart Full Refresh` (daily, UTC, with an expected client-availability time), owned by the **TDP**
team (Jira `TDP`, Tier Datamart Pipeline). Reports: **T1** and **T4**, each with a PA Request Name, a
Snowflake view, a Store Set UUID and a Product Set UUID. Delivery via Snowflake Share / SFTP /
OneDrive. **CIM visuals** (e.g. Price Index Heatmap). **Missions and Scanner** for in-store.

**Ongoing Issues** table: issue, description, status (IN PROGRESS / BLOCKED), owner, Jira link.

### Other retail data specs in the space

`Retail Data Collection` splits into *Products, Prices and Availability*, *Store Location Crawls* and
*Fuels*. There is also `Engage3 Inbound Data Specifications`, a `Data Dictionary`, `Flyer`
(brand/product/size/variant extracted from flyers) and `In-Store Data Collection High Level`.
Per-domain crawl research notes live in the same space under prefixes — `DT -` (Discount Tire),
`IA -`, `BW -`, `AZM -`, `CA -`, `US -`, `PDM -`, `CDS -`, `PX -`.

---

## 4. Jira: where tickets actually live

82 projects. The ones a `tickets` module must care about:

| Key | Project | Lead | Why it matters |
|---|---|---|---|
| `WDC` | Web Data Collection - Managed Projects | Edison Damjani | the crawl delivery work |
| `DTT` | Data Strategy Integration Team | Olsi Mahmutaj | integration plus **feasibility requests** |
| `E3BI` | ENGAGE3 Banner Implementation | Kevin Lico | onboarding a new banner |
| `EDO` | Engage3-DevOps | Brian Anderson | infrastructure, including our hosting ticket |
| `DEL` / `DRI` | Delivery / Delivery Retail Implementation | Chandler Eady / Benjamin Lister | delivery and retail implementation |
| `SI` / `CS` / `FC` / `SS` | Support Issues / Customer Solutions / Fuel-CustomerSolutions / SelfServedBrands-Support | Klodiana Halilaj (x3) | client-reported issues, split by vertical |
| `RDI` | Reporting and Data Issues | Ilda Caka | report and data defects |
| `TDP` | Tier Datamart Pipeline | Matt Shadish | DataMart refresh |
| `CPL` / `ML` | CIM: Product Linking / ML Linking | Elira Ismaili | linking and find-rate |
| `BOPS` | BrandOps | Sonila Biraku | the Brand line |
| `MO` / `MAD` / `MDO` / `MI` | Mozenda, Mozenda-Advanced-Data, Mozenda-DevOps, Mozenda-Infrastructure | Brian Anderson | the scraping platform itself |

**The crawl pods have their own Jira projects**, which is how to map a run to a team:
`SK` Skanderbeg (Kevin Lico), `SOTT` Smooth-Operators-Team (Lediana Omeri),
`DHT` DataHive-Team (Edison Damjani), `CST` Crawl-Stars-Team, `MAD` Mozenda-Advanced-Data.

→ `docs/modules.md` says the `tickets` module reads "Jira (OPS project)". **There is no `OPS`
project.** The sync needs a configurable list of project keys, and tickets need a `project_key`
column; a single-project assumption will not survive contact.

Jira also has per-client projects (Alcon, AutoZone, Deutsche Bank, Einhell, Groupe Seb, TUI,
Azimuth...), so client → Jira project is many-to-one at best.

---

## 5. Hosting: EDO-2313

`https://mozenda.atlassian.net/browse/EDO-2313` — "E3 - VM request", created 2026-10-29/30.

- Type Task, status **To Do**, priority 4 - Low, Sprint `2026-V`, parent `EDO-2118 2026-Q4: Customer`.
- Reporter **Olsi Mahmutaj**; assignee kejzi.nexha; Gilxhon Hima and Santjago Ulndreaj cc'd.
- Ask: **a GCP VM in the E3 environment**, **2 vCPU / 8 GB RAM / 15 GB storage**, described as hosting
  "a retail dashboard".
- The VM must reach:
  - **Store Postgres** — `storedb.produs.e3internal.com`
  - **e3-delivery** PostgreSQL — `e3-delivery-data` (`34.141.26.124`)
  - **Snowflake**

**What this changes in our plan**

1. The HANDOFF blocker "hosting target" is answered: **GCP VM, E3 environment**. It is still only
   requested, low priority and unstarted, so treat the date as unknown.
2. There are **three** upstream stores, not one vague "master request DB": Store Postgres,
   e3-delivery Postgres, and Snowflake. `packages/sources` should be shaped around those three.
   The Program Brief shows crawl-request data coming from **Snowflake**
   (`MISSION.ONLINE_CRAWL_REQUESTS`), while linking lives in `link.links_family`.
3. 15 GB of storage is small for our own Postgres plus run snapshots. If `runs` / `run_snapshots`
   retain history, say so on the ticket before the VM is built.
4. `wdcintegration.mozenda.com/nods/public_assignees` returned **403 Forbidden (nginx)** from outside
   the corporate network. NODS is network-restricted, so (a) reading NODS requires being inside the E3
   network — another reason the app must live on that VM — and (b) local dev against NODS needs VPN.
5. No SSO provider is named anywhere found. Still a genuine blocker.

---

## 6. Answers to the four questions in the draft

**Q: Hard or soft separation — should a Retail CSM be technically blocked from Brand data?**
Make it hard at the data layer, but note the premise is off: CSM scope is a **book of business**, not a
segment, because no CSM title carries a segment (section 2). Model it as
`csm_clients(user_id, client_id)` and enforce on that, then derive the segment filter from the clients
they hold. Row-level security on `client_id` gives the hard separation, and gives segment separation
for free.

**Q: Are the delivery teams split by segment?**
**No.** Data Strategy is split into four collection pods plus one integration pod, by manager, with no
segment in any title (section 2). Assume delivery engineers and delivery managers are cross-segment and
scope them by **pod / domain assignment**, not by segment. The only segment-split team is Customer
Solutions (Retail / Brand / Fuel team leads), which is a support function, not delivery.

**Q: Do the same domain and run ever feed both a Retail and a Brand client?**
Not confirmed either way from documents, but the structure suggests they are mostly separate: the Brand
spec collects a different field set (catalogue, no price, no store) from the retail Products/Prices/
Availability spec, so a Brand crawl of target.com is a different crawl from a Retail one. The draft's
"shared ops layer, fanned-out client impact" design is still the right shape — a blocked domain clearly
hits every program using it — but the *same run* feeding both is unproven. **Verify against the master
request DB** once read access exists: check whether any domain has active crawl requests for clients in
more than one business line.

**Q: What does a Brand client receive?**
Today, per the only Brand spec: a **product catalogue extract** per banner — identifiers
(`banner_id`, `banner_product_id`, parent, `sku`, `gtin`, `mpn`), name / brand / manufacturer /
description, category path, image, and normalised size / pack / variant attributes, with
`crawl_datetime`. **No price, no store, no match rate, no MAP, no seller data.** The draft's Brand
table should be rewritten to this.

---

## 7. What to change in the repo

1. `docs/modules.md`, `clients` row: `segment: brand / retail` → a business-line enum that includes
   `managed_services` (and probably `fuel`), with room to extend. (section 1)
2. `docs/modules.md`, `tickets` row: "Jira (OPS project)" → a configurable set of project keys; add
   `project_key` to `ticket_snapshots`. (section 4)
3. `docs/modules.md` access rules: CSM scope is per-client assignment, not per-segment. Add **Tech
   Lead**, and decide whether **Product Linking Analyst** is a user population we serve. (sections 2, 6)
4. `packages/sources`: plan for three clients — Store Postgres, e3-delivery Postgres, Snowflake — not a
   single "master request DB". (section 5)
5. `packages/shared/src/rules`: delivery projection should compare against `delivery_utc` from
   `MISSION.ONLINE_CRAWL_REQUESTS`, and **late client input** needs to be a distinct at-risk cause,
   separate from crawl failure. (section 3)
6. `docs/HANDOFF.md` blockers: hosting target answered (GCP VM, EDO-2313); add "NODS is
   network-restricted (403 externally) — dev needs VPN"; SSO still open. (section 5)
7. Do **not** build Brand-specific screens (SKU Coverage, Retailer Matrix) in early phases. (section 1)

## 8. Open questions for a human

1. ~~Is Managed Services in scope for this app at all, or is it Retail-only for v1?~~
   **Answered 2026-10-30: retail only for v1.** Managed Services and Brand are out of scope. Because
   the source systems hold all three, `business_line` stays in the schema as an unconditional filter
   at the API and DB boundary, not as a switch. Section 1's finding still matters for the same reason:
   a `brand | retail` enum cannot express "not retail".
2. Which of Store Postgres / e3-delivery / Snowflake is "the master request DB" as used in `CLAUDE.md`?
3. Is `Tech Lead` a distinct role, and do Product Linking Analysts need a view here?
4. Does a single domain ever serve clients in more than one business line? (section 6)
5. SSO provider — nothing found.
6. Is 15 GB enough given run-snapshot retention? (section 5)

## 9. Sources

- BambooHR directory — `https://engage3.bamboohr.com/anytime/directory.php` (238 records).
- Confluence space `DC` (Data Strategy) — folders `Engage3 - Retail`, `Engage3 - Brand Skunkworks`,
  `Managed Services - Client Documentation`, `Client ETL`, `Feasibility Requests`; pages
  `A TEMPLATE Retail Program Brief`, `Retail Data Collection`, `Retail Product Data Collection`.
- Jira `mozenda.atlassian.net` — project list (82 projects), issue `EDO-2313`.
- `https://wdcintegration.mozenda.com/nods/public_assignees` — 403 Forbidden from outside the network.

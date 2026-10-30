# Phase 0: Foundations

Goal: a solid base so every feature after this is just a module.

| ID | Task | Module | Size | Depends on |
|---|---|---|---|---|
| RDIT-2 | Validate env at startup with zod (api, worker), fail fast with a clear message | shared | S | |
| RDIT-8 | Structured logging (pino via Fastify), request IDs, redact secrets | api | S | |
| RDIT-6 | Global error filter: consistent error shape `{ code, message, details }` | api | S | |
| RDIT-4 | Move api code to `src/modules/*` layout from `docs/modules.md`; add `users`, `audit` modules | api | S | |
| RDIT-5 | Dev auth: login as a seeded user, session cookie; `@CurrentUser()` decorator | auth | M | RDIT-4 |
| RDIT-7 | RBAC guard (`@Roles()`) and client-segment scoping helper used by every query | auth | M | RDIT-5 |
| RDIT-10 | Audit service: every write records actor, action, entity, before/after | audit | S | RDIT-4 |
| RDIT-3 | Seed script: users of each role, brand + retail clients, domains (from prototype mock data) | db | M | |
| RDIT-1 | Typed API client for web generated from OpenAPI (orval or openapi-typescript) | web | M | RDIT-4 |
| RDIT-9 | Web shell: sidebar per role, theme toggle, auth guard, error and empty states | web | M | RDIT-5, RDIT-1 |
| RDIT-11 | Testing setup: Vitest for shared rules, api e2e test against a test DB in CI (Postgres service) | infra | M | |
| RDIT-12 | Dockerfiles for api, worker, web; compose profile to run the whole stack | infra | S | |

## Acceptance criteria
- **RDIT-2:** Missing `DATABASE_URL` stops the api with "DATABASE_URL is required" and exit code 1.
- **RDIT-5, RDIT-7:** A CSM user calling `GET /api/domains` only gets domains of their clients; a request for another segment returns 403. Covered by e2e tests.
- **RDIT-3:** `pnpm db:seed` is idempotent and creates at least one user per role and clients in both segments.
- **RDIT-9:** Switching the logged-in user changes the pinned nav like the prototype's role switcher.

# Phase 0: Foundations

Goal: a solid base so every feature after this is just a module.

| ID | Task | Module | Size | Depends on | Status |
|---|---|---|---|---|---|
| NCC-001 | Validate env at startup with zod (api, worker), fail fast with a clear message | shared | S | | done |
| NCC-002 | Structured logging (pino via Fastify), request IDs, redact secrets | api | S | | todo |
| NCC-003 | Global error filter: consistent error shape `{ code, message, details }` | api | S | | todo |
| NCC-004 | Move api code to `src/modules/*` layout from `docs/modules.md`; add `users`, `audit` modules | api | S | | todo |
| NCC-005 | Dev auth: login as a seeded user, session cookie; `@CurrentUser()` decorator | auth | M | NCC-004 | todo |
| NCC-006 | RBAC guard (`@Roles()`) and client-segment scoping helper used by every query | auth | M | NCC-005 | todo |
| NCC-007 | Audit service: every write records actor, action, entity, before/after | audit | S | NCC-004 | todo |
| NCC-008 | Seed script: users of each role, brand + retail clients, domains (from prototype mock data) | db | M | | todo |
| NCC-009 | Typed API client for web generated from OpenAPI (orval or openapi-typescript) | web | M | NCC-004 | todo |
| NCC-010 | Web shell: sidebar per role, theme toggle, auth guard, error and empty states | web | M | NCC-005, NCC-009 | todo |
| NCC-011 | Testing setup: Vitest for shared rules, api e2e test against a test DB in CI (Postgres service) | infra | M | | todo |
| NCC-012 | Dockerfiles for api, worker, web; compose profile to run the whole stack | infra | S | | todo |

## Acceptance criteria
- **NCC-001:** Missing `DATABASE_URL` stops the api with "DATABASE_URL is required" and exit code 1.
- **NCC-005/006:** A CSM user calling `GET /api/domains` only gets domains of their clients; a request for another segment returns 403. Covered by e2e tests.
- **NCC-008:** `pnpm db:seed` is idempotent and creates at least one user per role and clients in both segments.
- **NCC-010:** Switching the logged-in user changes the pinned nav like the prototype's role switcher.

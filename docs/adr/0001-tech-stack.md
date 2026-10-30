# ADR 0001: Tech stack

- Status: Proposed
- Date: 2026-10-19

## Context

Nods Control Center sits on top of systems we already run: the master request database (PostgreSQL), Mozenda, Jira, Slack, and the ticket-generation, input-generation and dedup services. It must give delivery engineers, delivery managers, CSMs and the Integration Team one view of runs, deliveries, tickets and blocked domains, and keep brand and retail clients separate.

It is an internal tool that will grow module by module (domains, runs, deliveries, tickets, proxies, stores, baselines, assignments), and it must never write to the source systems.

## Decision

- **One TypeScript monorepo** with pnpm workspaces and Turborepo, so the frontend, API and jobs share types and validation.
- **API: NestJS on the Fastify adapter.** Modules map onto the product areas; guards handle roles and the brand/retail separation; structure is familiar to Spring Boot developers.
- **Worker: a second NestJS app** with `@nestjs/schedule` for polling and **pg-boss** for durable jobs on Postgres (no Redis).
- **Our own PostgreSQL** with **Drizzle ORM** for data only this platform owns: assignments history, baseline changes, blocked domains, deliveries, audit log.
- **Read-only access** to the existing master request database (read-only user, plus read-only sessions enforced in code) and to Mozenda, Jira and Slack APIs.
- **Frontend: React + Vite** with TanStack Router, Query and Table, Tailwind CSS and shadcn/ui, Recharts for charts. No server rendering: the app sits behind a login.
- **Validation: zod**, shared between frontend and API through `@ncc/shared`.
- **Auth: company sign-in over OIDC**, with role and client-segment scoping enforced in API guards.
- **Tooling:** Biome (lint + format), Vitest, GitHub Actions. Observability through Prometheus metrics into the existing Grafana, plus Sentry.
- **Node 26 LTS.** Switched from Node 24 on 30 Oct 2026, two days after 26 entered LTS; Node 24 went to maintenance on 20 Oct 2026.
- **Latest stable dependencies with a 2-day buffer:** pnpm's `minimumReleaseAge` only accepts versions published at least 2 days ago.
- **TypeScript 6.** TypeScript 7 does not yet expose the compiler API the Nest CLI needs (expected in 7.1). Upgrade when it does.

## Consequences

- One language and one set of types end to end; less duplication between UI and API.
- NestJS adds some boilerplate but keeps a growing codebase consistent.
- Source systems stay untouched: anything we need to keep (history, alerts) is snapshotted into our own database by the worker.
- Hosting, SSO provider and API credentials still need confirmation from IT.

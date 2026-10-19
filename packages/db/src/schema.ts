/**
 * Tables owned by Nods Control Center. Data that already lives elsewhere
 * (master requests, Mozenda runs, Jira tickets) is read from those systems, not copied here,
 * except for snapshots we need for history and alerting.
 */
import { boolean, index, integer, pgEnum, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core'

export const roleEnum = pgEnum('role', ['delivery_engineer', 'delivery_manager', 'csm', 'integration'])
export const segmentEnum = pgEnum('client_segment', ['brand', 'retail'])
export const scrapeTypeEnum = pgEnum('scrape_type', ['full_site', 'targeted', 'category', 'search_pages'])
export const cadenceEnum = pgEnum('cadence', ['weekly', 'biweekly', 'monthly', 'quarterly'])
export const deliveryStatusEnum = pgEnum('delivery_status', [
  'scheduled',
  'on_track',
  'at_risk',
  'upload_failed',
  'blocked',
  'missing',
  'delivered',
])

const createdAt = () => timestamp('created_at', { withTimezone: true }).notNull().defaultNow()

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: text('email').notNull().unique(),
  name: text('name').notNull(),
  role: roleEnum('role').notNull(),
  managerId: uuid('manager_id'),
  active: boolean('active').notNull().default(true),
  createdAt: createdAt(),
})

export const clients = pgTable('clients', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  segment: segmentEnum('segment').notNull(),
  csmUserId: uuid('csm_user_id').references(() => users.id),
  createdAt: createdAt(),
})

export const domains = pgTable(
  'domains',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    clientId: uuid('client_id')
      .notNull()
      .references(() => clients.id),
    bannerId: integer('banner_id'),
    baseUrl: text('base_url').notNull(),
    scrapeType: scrapeTypeEnum('scrape_type').notNull(),
    cadence: cadenceEnum('cadence').notNull().default('weekly'),
    runWindow: text('run_window').notNull(),
    configIdent: text('config_ident'),
    deliveryEngineerId: uuid('delivery_engineer_id').references(() => users.id),
    createdAt: createdAt(),
  },
  (t) => [index('domains_client_idx').on(t.clientId), index('domains_engineer_idx').on(t.deliveryEngineerId)],
)

/** Full history of who owned a domain and when. */
export const domainAssignments = pgTable('domain_assignments', {
  id: uuid('id').primaryKey().defaultRandom(),
  domainId: uuid('domain_id')
    .notNull()
    .references(() => domains.id),
  deliveryEngineerId: uuid('delivery_engineer_id').references(() => users.id),
  assignedBy: uuid('assigned_by')
    .notNull()
    .references(() => users.id),
  note: text('note'),
  createdAt: createdAt(),
})

/** Baseline per domain, optionally per store. Every change is kept and linked to a ticket. */
export const baselineChanges = pgTable(
  'baseline_changes',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    domainId: uuid('domain_id')
      .notNull()
      .references(() => domains.id),
    storeId: integer('store_id'),
    previousValue: integer('previous_value'),
    newValue: integer('new_value').notNull(),
    reason: text('reason').notNull(),
    ticketKey: text('ticket_key').notNull(),
    changedBy: uuid('changed_by')
      .notNull()
      .references(() => users.id),
    createdAt: createdAt(),
  },
  (t) => [index('baseline_changes_domain_idx').on(t.domainId)],
)

/** Periods when a site was blocking us. resolvedAt is null while still blocked. */
export const domainBlocks = pgTable('domain_blocks', {
  id: uuid('id').primaryKey().defaultRandom(),
  domainId: uuid('domain_id')
    .notNull()
    .references(() => domains.id),
  scope: text('scope').notNull(),
  cause: text('cause').notNull(),
  workaround: text('workaround'),
  expectedRecovery: text('expected_recovery'),
  clientImpact: text('client_impact'),
  ticketKey: text('ticket_key'),
  blockedSince: timestamp('blocked_since', { withTimezone: true }).notNull(),
  resolvedAt: timestamp('resolved_at', { withTimezone: true }),
  createdAt: createdAt(),
})

/** One expected client delivery per domain per run window. */
export const deliveries = pgTable(
  'deliveries',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    domainId: uuid('domain_id')
      .notNull()
      .references(() => domains.id),
    runId: text('run_id'),
    isoWeek: integer('iso_week').notNull(),
    isoYear: integer('iso_year').notNull(),
    dueAt: timestamp('due_at', { withTimezone: true }).notNull(),
    status: deliveryStatusEnum('status').notNull().default('scheduled'),
    deliveredAt: timestamp('delivered_at', { withTimezone: true }),
    destination: text('destination'),
    fileName: text('file_name'),
    createdAt: createdAt(),
  },
  (t) => [index('deliveries_due_idx').on(t.dueAt)],
)

/** Every write made through the platform. */
export const auditLog = pgTable('audit_log', {
  id: uuid('id').primaryKey().defaultRandom(),
  actorId: uuid('actor_id').references(() => users.id),
  action: text('action').notNull(),
  entity: text('entity').notNull(),
  entityId: text('entity_id'),
  details: text('details'),
  createdAt: createdAt(),
})

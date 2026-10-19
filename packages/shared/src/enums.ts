/** Who uses the platform. Drives navigation, default scope and permissions. */
export const ROLES = ['delivery_engineer', 'delivery_manager', 'csm', 'integration'] as const
export type Role = (typeof ROLES)[number]

/** Clients are either brands or retailers. Data for the two segments is kept separate. */
export const CLIENT_SEGMENTS = ['brand', 'retail'] as const
export type ClientSegment = (typeof CLIENT_SEGMENTS)[number]

export const SCRAPE_TYPES = ['full_site', 'targeted', 'category', 'search_pages'] as const
export type ScrapeType = (typeof SCRAPE_TYPES)[number]

export const CADENCES = ['weekly', 'biweekly', 'monthly', 'quarterly'] as const
export type Cadence = (typeof CADENCES)[number]

/**
 * Run status. "blocked" means the site is blocking us and is kept separate from "failed",
 * which means something broke on our side.
 */
export const RUN_STATUSES = ['scheduled', 'running', 'at_risk', 'delayed', 'low_count', 'blocked', 'failed', 'completed'] as const
export type RunStatus = (typeof RUN_STATUSES)[number]

export const DELIVERY_STATUSES = ['scheduled', 'on_track', 'at_risk', 'upload_failed', 'blocked', 'missing', 'delivered'] as const
export type DeliveryStatus = (typeof DELIVERY_STATUSES)[number]

export const TICKET_ROOT_CAUSES = [
  'site_change_product_count',
  'site_change_store_unavailable',
  'site_change_products_without_price',
  'site_change_products_unavailable',
  'late_crawl_data',
  'crawl_order_issue',
  'blocked_domain',
  'unassigned',
] as const
export type TicketRootCause = (typeof TICKET_ROOT_CAUSES)[number]

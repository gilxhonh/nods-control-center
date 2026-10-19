import { z } from 'zod'
import { CADENCES, CLIENT_SEGMENTS, RUN_STATUSES, SCRAPE_TYPES } from './enums'

export const clientSchema = z.object({
  id: z.uuid(),
  name: z.string().min(1),
  segment: z.enum(CLIENT_SEGMENTS),
  csmUserId: z.uuid().nullable(),
})
export type Client = z.infer<typeof clientSchema>

export const domainSchema = z.object({
  id: z.uuid(),
  clientId: z.uuid(),
  bannerId: z.number().int().nullable(),
  baseUrl: z.string().min(1),
  scrapeType: z.enum(SCRAPE_TYPES),
  cadence: z.enum(CADENCES),
  runWindow: z.string().min(1),
  configIdent: z.string().nullable(),
  deliveryEngineerId: z.uuid().nullable(),
})
export type Domain = z.infer<typeof domainSchema>

export const runSummarySchema = z.object({
  runId: z.string(),
  domainId: z.uuid(),
  status: z.enum(RUN_STATUSES),
  progress: z.number().min(0).max(1),
  captured: z.number().int().nonnegative(),
  baseline: z.number().int().nonnegative(),
  startedAt: z.iso.datetime().nullable(),
  expectedAt: z.iso.datetime().nullable(),
})
export type RunSummary = z.infer<typeof runSummarySchema>

export const changeBaselineSchema = z.object({
  newBaseline: z.number().int().positive(),
  reason: z.string().min(5),
  ticketKey: z.string().min(1),
  storeIds: z.array(z.number().int()).optional(),
})
export type ChangeBaselineInput = z.infer<typeof changeBaselineSchema>

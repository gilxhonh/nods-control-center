import { z } from 'zod'

// Only the variables each app reads today. Integration keys are checked by their source clients when used.
export const apiEnvSchema = z.object({
  DATABASE_URL: z.url(),
  API_PORT: z.coerce.number().int().positive().default(3000),
  WEB_ORIGIN: z.url().default('http://localhost:5173'),
})
export type ApiEnv = z.infer<typeof apiEnvSchema>

export const workerEnvSchema = z.object({
  DATABASE_URL: z.url(),
})
export type WorkerEnv = z.infer<typeof workerEnvSchema>

/** Parses env at startup; throws one error naming every bad variable. Empty values (`KEY=`) count as missing. */
export function parseEnv<T extends z.ZodType>(schema: T, env: Record<string, unknown>): z.output<T> {
  const present = Object.fromEntries(Object.entries(env).filter(([, v]) => v !== ''))
  const result = schema.safeParse(present)
  if (result.success) return result.data
  const problems = result.error.issues.map((i) => {
    const key = i.path.join('.')
    return present[key] === undefined ? `${key} is required` : `${key}: ${i.message}`
  })
  throw new Error(`Invalid environment:\n  ${problems.join('\n  ')}`)
}

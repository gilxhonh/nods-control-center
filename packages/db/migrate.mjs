// Applies pending migrations and prints the real error if it fails
// (drizzle-kit's own migrate command hides connection errors).
import { existsSync } from 'node:fs'
import { drizzle } from 'drizzle-orm/postgres-js'
import { migrate } from 'drizzle-orm/postgres-js/migrator'
import postgres from 'postgres'

for (const f of ['.env', '../../.env']) if (existsSync(f)) process.loadEnvFile(f)
const url = process.env.DATABASE_URL ?? 'postgres://ncc:ncc@localhost:5432/ncc'
const safeUrl = url.replace(/\/\/([^:]+):[^@]*@/, '//$1:***@')

const client = postgres(url, { max: 1, onnotice: () => {} })
try {
  console.log(`Applying migrations to ${safeUrl}`)
  await migrate(drizzle(client), { migrationsFolder: './migrations' })
  console.log('Migrations applied.')
} catch (err) {
  const cause = err?.cause ?? err
  console.error(`Migration failed: ${cause?.code ?? ''} ${cause?.message ?? err}`.trim())
  if (cause?.code === 'ECONNREFUSED')
    console.error('Postgres is not reachable. Start it with "pnpm db:up" (Docker Desktop must be running).')
  if (cause?.code === '28P01')
    console.error('Wrong username or password. Another Postgres may already be using port 5432, or DATABASE_URL in .env is wrong.')
  if (cause?.code === '3D000') console.error('The database does not exist. Check the database name in DATABASE_URL.')
  process.exitCode = 1
} finally {
  await client.end()
}

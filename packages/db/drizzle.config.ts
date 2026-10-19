import { existsSync } from 'node:fs'
import { defineConfig } from 'drizzle-kit'

for (const f of ['.env', '../../.env']) if (existsSync(f)) process.loadEnvFile(f)

export default defineConfig({
  schema: './src/schema.ts',
  out: './migrations',
  dialect: 'postgresql',
  dbCredentials: { url: process.env.DATABASE_URL ?? 'postgres://ncc:ncc@localhost:5432/ncc' },
})

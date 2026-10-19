import postgres from 'postgres'

/**
 * Read-only access to the existing master request database.
 * Every session is forced read-only, on top of the read-only database user.
 */
export function createMasterRequestSource(url = process.env.SOURCE_DATABASE_URL) {
  if (!url) throw new Error('SOURCE_DATABASE_URL is not set')
  const sql = postgres(url, {
    max: 5,
    connection: { default_transaction_read_only: true, statement_timeout: 30_000 },
  })
  return {
    sql,
    async ping() {
      const [row] = await sql`select 1 as ok`
      return row?.ok === 1
    },
    // TODO: map the real tables (requests per config_ident, inputs, stores) once access is granted.
  }
}

import { apiEnvSchema, parseEnv } from '@ncc/shared'
import { describe, expect, it } from 'vitest'

// shortcut: parseEnv lives in packages/shared but is tested here until NCC-011 gives shared its own Vitest setup.
describe('parseEnv(apiEnvSchema)', () => {
  it('names a missing variable', () => {
    expect(() => parseEnv(apiEnvSchema, {})).toThrow('DATABASE_URL is required')
  })

  it('treats an empty value as missing', () => {
    expect(() => parseEnv(apiEnvSchema, { DATABASE_URL: '' })).toThrow('DATABASE_URL is required')
  })

  it('reports every bad variable at once', () => {
    expect(() => parseEnv(apiEnvSchema, { DATABASE_URL: 'not a url', API_PORT: 'abc' })).toThrow(/DATABASE_URL: .*\n\s+API_PORT: /)
  })

  it('applies defaults and coerces the port', () => {
    expect(parseEnv(apiEnvSchema, { DATABASE_URL: 'postgres://ncc:ncc@localhost:5433/ncc' })).toEqual({
      DATABASE_URL: 'postgres://ncc:ncc@localhost:5433/ncc',
      API_PORT: 3000,
      WEB_ORIGIN: 'http://localhost:5173',
    })
  })
})

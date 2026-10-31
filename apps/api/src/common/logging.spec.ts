import { Body, Controller, Get, Logger, Post } from '@nestjs/common'
import { FastifyAdapter, type NestFastifyApplication } from '@nestjs/platform-fastify'
import { Test } from '@nestjs/testing'
import { afterEach, describe, expect, it } from 'vitest'
import { fastifyOptions, useRequestLogging } from './logging'

@Controller('probe')
class ProbeController {
  private readonly log = new Logger('Probe')

  @Get()
  get() {
    this.log.log({
      msg: 'probe',
      token: 'tok-1',
      apiKey: 'k-123',
      headers: { authorization: 'Bearer abc', Cookie: 'sid=c-1', 'set-cookie': 'sid=s-1' },
    })
    return {}
  }

  @Get('error')
  error() {
    // Shape of an HTTP client error: the auth header sits three levels under err.
    const err = Object.assign(new Error('upstream failed'), {
      response: { headers: { Authorization: 'Bearer ERR' } },
      config: { headers: { authorization: 'Bearer CFG' } },
    })
    this.log.error(err)
    new Logger().error('no context', err.stack)
    return {}
  }

  @Post()
  async post(@Body() body: { password: string }) {
    await new Promise((r) => setTimeout(r, 5))
    this.log.log({ msg: 'posted', password: body.password })
    return {}
  }
}

describe('request logging', () => {
  let app: NestFastifyApplication
  const lines: Record<string, unknown>[] = []

  async function start() {
    const mod = await Test.createTestingModule({ controllers: [ProbeController] }).compile()
    const stream = { write: (line: string) => lines.push(JSON.parse(line)) }
    app = mod.createNestApplication<NestFastifyApplication>(new FastifyAdapter(fastifyOptions(stream)), { bufferLogs: true })
    useRequestLogging(app)
    await app.init()
    await app.getHttpAdapter().getInstance().ready()
  }

  afterEach(async () => {
    lines.length = 0
    await app.close()
  })

  it('reuses a valid x-request-id, returns it and tags Nest logs with it', async () => {
    await start()
    const res = await app.inject({ method: 'GET', url: '/probe', headers: { 'x-request-id': 'abc-123' } })

    expect(res.headers['x-request-id']).toBe('abc-123')
    const probe = lines.find((l) => l.context === 'Probe')
    expect(probe).toMatchObject({ reqId: 'abc-123', msg: 'probe' })
    expect(lines.filter((l) => l.reqId === 'abc-123').length).toBeGreaterThanOrEqual(3)
  })

  it('keeps the reqId on logs after a POST body was parsed and an await', async () => {
    await start()
    await app.inject({ method: 'POST', url: '/probe', headers: { 'x-request-id': 'post-1' }, payload: { password: 'p@ss' } })

    expect(lines.find((l) => l.msg === 'posted')).toMatchObject({ reqId: 'post-1', password: '[Redacted]' })
  })

  it('generates a UUID when the incoming id is missing or unsafe', async () => {
    await start()
    const res = await app.inject({ method: 'GET', url: '/probe', headers: { 'x-request-id': 'bad id\n{"x":1}' } })

    expect(res.headers['x-request-id']).toMatch(/^[0-9a-f-]{36}$/)
  })

  it('redacts secrets', async () => {
    await start()
    await app.inject({ method: 'GET', url: '/probe' })

    const probe = lines.find((l) => l.context === 'Probe')
    expect(probe).toMatchObject({
      token: '[Redacted]',
      apiKey: '[Redacted]',
      headers: { authorization: '[Redacted]', Cookie: '[Redacted]', 'set-cookie': '[Redacted]' },
    })
    const all = JSON.stringify(lines)
    for (const secret of ['Bearer abc', 'tok-1', 'k-123', 'c-1', 's-1']) expect(all).not.toContain(secret)
  })

  it('redacts headers nested in logged errors', async () => {
    await start()
    await app.inject({ method: 'GET', url: '/probe/error' })

    const all = JSON.stringify(lines)
    expect(all).toContain('upstream failed')
    expect(all).not.toContain('Bearer ERR')
    expect(all).not.toContain('Bearer CFG')
  })

  it('keeps a stack passed without a context as the stack', async () => {
    await start()
    await app.inject({ method: 'GET', url: '/probe/error' })

    const line = lines.find((l) => l.msg === 'no context')
    expect(line?.context).toBeUndefined()
    expect(line?.stack).toMatch(/upstream failed\n\s+at /)
  })
})

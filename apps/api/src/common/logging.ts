import { AsyncLocalStorage } from 'node:async_hooks'
import { randomUUID } from 'node:crypto'
import type { LoggerService } from '@nestjs/common'
import type { NestFastifyApplication } from '@nestjs/platform-fastify'
import type { FastifyBaseLogger, FastifyServerOptions } from 'fastify'

// Redaction matches exact keys, so header names are listed in both cases HTTP clients send them.
const SECRET_KEYS = [
  'authorization',
  'Authorization',
  'cookie',
  'Cookie',
  'set-cookie',
  'Set-Cookie',
  'password',
  'token',
  'accessToken',
  'refreshToken',
  'secret',
  'clientSecret',
  'apiKey',
  'api_key',
]
// Incoming ids are reused for tracing across services, but only when they look like an id.
const SAFE_REQUEST_ID = /^[\w.-]{1,128}$/
// Same test Nest's ConsoleLogger uses to tell a stack from a context string.
const STACK_FORMAT = /^(.)+\n\s+at .+:\d+:\d+/

const requestLog = new AsyncLocalStorage<FastifyBaseLogger>()

/** Fastify options: pino JSON logs, secrets redacted up to four levels deep (e.g. err.response.headers.authorization), one id per request. */
export function fastifyOptions(stream?: { write(line: string): void }): FastifyServerOptions {
  return {
    logger: {
      redact: {
        paths: SECRET_KEYS.flatMap((k) => [`["${k}"]`, `*["${k}"]`, `*.*["${k}"]`, `*.*.*["${k}"]`]),
        censor: '[Redacted]',
      },
      ...(stream && { stream }),
    },
    requestIdHeader: false,
    genReqId: (req) => {
      const id = req.headers['x-request-id']
      return typeof id === 'string' && SAFE_REQUEST_ID.test(id) ? id : randomUUID()
    },
  }
}

/** Sends Nest's Logger through Fastify's pino and tags lines written during a request with its reqId. */
export function useRequestLogging(app: NestFastifyApplication) {
  const fastify = app.getHttpAdapter().getInstance()
  fastify.addHook('onRequest', (req, reply, done) => {
    reply.header('x-request-id', req.id)
    requestLog.run(req.log, done)
  })
  app.useLogger(new PinoLogger(fastify.log))
}

class PinoLogger implements LoggerService {
  constructor(private readonly root: FastifyBaseLogger) {}

  log(message: unknown, ...params: unknown[]) {
    this.write('info', message, params)
  }
  error(message: unknown, ...params: unknown[]) {
    this.write('error', message, params)
  }
  warn(message: unknown, ...params: unknown[]) {
    this.write('warn', message, params)
  }
  debug(message: unknown, ...params: unknown[]) {
    this.write('debug', message, params)
  }
  verbose(message: unknown, ...params: unknown[]) {
    this.write('trace', message, params)
  }
  fatal(message: unknown, ...params: unknown[]) {
    this.write('fatal', message, params)
  }

  // Nest passes (message, context?) or, for errors, (message, stack?, context?).
  private write(level: 'info' | 'error' | 'warn' | 'debug' | 'trace' | 'fatal', message: unknown, params: unknown[]) {
    const stack = level === 'error' && typeof params[0] === 'string' && STACK_FORMAT.test(params[0]) ? params[0] : undefined
    const last = params.at(-1)
    const context = typeof last === 'string' && last !== stack ? last : undefined
    const err = message instanceof Error ? message : params.find((p) => p instanceof Error)
    const fields = { context, ...(stack && { stack }), ...(err ? { err } : {}) }
    const log = requestLog.getStore() ?? this.root
    if (typeof message === 'object' && message !== null && !(message instanceof Error)) log[level]({ ...fields, ...message })
    else log[level](fields, message instanceof Error ? message.message : String(message))
  }
}

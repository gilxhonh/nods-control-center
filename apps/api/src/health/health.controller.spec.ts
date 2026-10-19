import { Test } from '@nestjs/testing'
import { describe, expect, it } from 'vitest'
import { HealthController } from './health.controller'

describe('HealthController', () => {
  it('reports ok', async () => {
    const mod = await Test.createTestingModule({ controllers: [HealthController] }).compile()
    expect(mod.get(HealthController).check().status).toBe('ok')
  })
})

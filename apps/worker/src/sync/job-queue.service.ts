import { Injectable, Logger, type OnModuleDestroy, type OnModuleInit } from '@nestjs/common'
import { PgBoss } from 'pg-boss'

/** Durable job queue on our own Postgres (no Redis needed). */
@Injectable()
export class JobQueueService implements OnModuleInit, OnModuleDestroy {
  private readonly log = new Logger(JobQueueService.name)
  boss?: PgBoss

  async onModuleInit() {
    const url = process.env.DATABASE_URL
    if (!url) {
      this.log.warn('DATABASE_URL not set, job queue disabled')
      return
    }
    this.boss = new PgBoss(url)
    this.boss.on('error', (err) => this.log.error(err))
    await this.boss.start()
    this.log.log('Job queue started')
  }

  async onModuleDestroy() {
    await this.boss?.stop()
  }
}

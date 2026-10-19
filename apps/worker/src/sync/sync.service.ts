import { Injectable, Logger } from '@nestjs/common'
import { Interval } from '@nestjs/schedule'

/**
 * Polls the source systems on a schedule. Each sync is read-only towards the source
 * and writes snapshots into our own database.
 */
@Injectable()
export class SyncService {
  private readonly log = new Logger(SyncService.name)

  @Interval('mozenda', 2 * 60_000)
  syncMozenda() {
    // TODO: read sequence progress for active runs via @ncc/sources and store snapshots.
    this.log.debug('Mozenda sync tick')
  }

  @Interval('jira', 60_000)
  syncJira() {
    // TODO: pull OPS tickets updated since the last sync.
    this.log.debug('Jira sync tick')
  }
}

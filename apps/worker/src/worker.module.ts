import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { ScheduleModule } from '@nestjs/schedule'
import { JobQueueService } from './sync/job-queue.service'
import { SyncService } from './sync/sync.service'

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true, envFilePath: ['.env', '../../.env'] }), ScheduleModule.forRoot()],
  providers: [JobQueueService, SyncService],
})
export class WorkerModule {}

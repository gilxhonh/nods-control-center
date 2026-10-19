import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { DomainsModule } from './domains/domains.module'
import { HealthController } from './health/health.controller'

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true, envFilePath: ['.env', '../../.env'] }), DomainsModule],
  controllers: [HealthController],
})
export class AppModule {}

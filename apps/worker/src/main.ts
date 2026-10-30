import 'reflect-metadata'
import { NestFactory } from '@nestjs/core'
import { WorkerModule } from './worker.module'

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(WorkerModule, { abortOnError: false })
  app.enableShutdownHooks()
}

bootstrap().catch((err: Error) => {
  console.error(err.message)
  process.exit(1)
})

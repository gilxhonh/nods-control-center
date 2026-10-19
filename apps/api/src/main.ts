import 'reflect-metadata'
import { NestFactory } from '@nestjs/core'
import { FastifyAdapter, type NestFastifyApplication } from '@nestjs/platform-fastify'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { AppModule } from './app.module'

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter({ logger: true }))
  app.setGlobalPrefix('api')
  app.enableCors({ origin: process.env.WEB_ORIGIN ?? 'http://localhost:5173', credentials: true })

  const docs = new DocumentBuilder().setTitle('Nods Control Center API').setVersion('0.1.0').build()
  SwaggerModule.setup('api/docs', app, SwaggerModule.createDocument(app, docs))

  await app.listen({ port: Number(process.env.API_PORT ?? 3000), host: '0.0.0.0' })
}

void bootstrap()

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import compression from '@fastify/compress';

import {
  NestFastifyApplication,
  FastifyAdapter,
} from '@nestjs/platform-fastify';
import config from './config/app';
import { ValidationPipe } from '@nestjs/common';
async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );
  app.enableCors();
  app.register(compression);
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  await app.listen(config.port);
}
bootstrap();

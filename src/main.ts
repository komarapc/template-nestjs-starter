import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import compression from '@fastify/compress';
import {
  NestFastifyApplication,
  FastifyAdapter,
} from '@nestjs/platform-fastify';
async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );
  app.enableCors();
  app.register(compression);
  await app.listen(3000);
}
bootstrap();

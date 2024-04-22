import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import path, { join } from 'path';
import fastifyStatic from '@fastify/static';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import configApp from './config/app';
import { ValidationPipe } from '@nestjs/common';
import { debugConsole } from './lib/utils';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );
  app.register(fastifyStatic, {
    root: join(__dirname, '../../public'),
    prefix: '/public/',
  });
  app.setGlobalPrefix('api');
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  const config = new DocumentBuilder()
    .addBearerAuth()
    .setTitle('NestJS API')
    .setDescription('The NestJS API description')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document, {
    swaggerOptions: {
      defaultModelsExpandDepth: -1,
    },
    customCss: `.swagger-ui .topbar { display: none }`,
    customCssUrl: '../public/css/theme-openapi.css',
    customSiteTitle: 'API Docs',
    customfavIcon: '../public/nestjs-icon.svg',
  });

  try {
    await app.listen(configApp.port);
  } catch (error) {
    debugConsole(error);
    process.exit(1);
  }
}

bootstrap();

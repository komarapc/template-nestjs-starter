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
    .setTitle('NestJS Starter API')
    .setDescription('The NestJS API description')
    .setVersion('1.0')
    .setContact(
      'izmikomar',
      'https://github.com/komarapc',
      'komar.izmi@gmail.com',
    )
    .setLicense('MIT', 'https://opensource.org/licenses/MIT')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document, {
    swaggerOptions: {
      defaultModelsExpandDepth: -1,
      // docExpansion: 'none',
      filter: true,
      showRequestDuration: true,
      tagsSorter: 'alpha',
      operationsSorter: 'alpha',
      syntaxHighlight: {
        activate: true,
        theme: 'arta',
      },
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

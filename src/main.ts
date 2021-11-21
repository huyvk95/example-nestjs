import { VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
// eslint-disable-next-line import/no-extraneous-dependencies
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // > Versioning
  app.enableVersioning({
    type: VersioningType.URI,
  });

  // > Swagger
  const configSwagger = new DocumentBuilder()
    .setTitle('Nest example')
    .setDescription('The nestjs example project')
    .setVersion('1.0')
    .build();
  const documentSwagger = SwaggerModule.createDocument(app, configSwagger);
  SwaggerModule.setup('api', app, documentSwagger);

  await app.listen(3000);
}
bootstrap();

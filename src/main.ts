import { NestFactory } from '@nestjs/core';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as helmet from 'helmet';
import * as morgan from 'morgan';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // > Middleware
  app.use(helmet());
  app.use(morgan('combined'));

  // > Versioning
  app.enableVersioning({
    type: VersioningType.URI,
  });

  // > Validation
  app.useGlobalPipes(new ValidationPipe({ stopAtFirstError: true }));

  // > Swagger
  const configSwagger = new DocumentBuilder()
    .setTitle('Nest example')
    .setDescription('The nestjs example project')
    .setVersion('1.0')
    .addBearerAuth({ type: 'apiKey', name: 'authorization', in: 'header' })
    .build();
  const documentSwagger = SwaggerModule.createDocument(app, configSwagger);
  SwaggerModule.setup('api', app, documentSwagger);

  await app.listen(process.env.PORT);
}
bootstrap();

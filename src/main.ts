import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe())
  const config = new DocumentBuilder()
    .setTitle('Solongevity Dashboard')
    .setDescription('The API description for Development')
    .setVersion('Dev 1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  const cssOptions = {
    customSiteTitle: 'Solongevity Dashboard APIs',
  };
  SwaggerModule.setup('/', app, document, {
    swaggerOptions: {
      defaultModelsExpandDepth: -1,
      tagsSorter: 'alpha',
      filter: true,
    },
    customSiteTitle: cssOptions.customSiteTitle,
  });
  await app.listen(3000);
}
bootstrap();

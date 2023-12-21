import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { snapshot: true });

  const config = new DocumentBuilder()
    .setTitle('Haven AI API')
    .setDescription('AI integration for Haven')
    .setVersion('1.0')
    .addTag('haven')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.enableCors();
  await app.listen(3331);
}
bootstrap();

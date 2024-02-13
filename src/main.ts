import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { MyLogger } from './modules/logger/services/logger.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { snapshot: true });
  app.useLogger(app.get(MyLogger));

  const config = new DocumentBuilder()
    .setTitle('Haven AI API')
    .setDescription('AI integration for Haven')
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('haven')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.enableCors();
  await app.listen(process.env.PORT || 3000);
}
bootstrap();

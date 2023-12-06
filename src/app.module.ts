import { Module, ValidationPipe } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { OpenaiModule } from './modules/openai/openai.module';
import { DatabaseModule } from './modules/database/database.module';
import { DevtoolsModule } from '@nestjs/devtools-integration';
import { APP_PIPE } from '@nestjs/core';
import { AssistantsModule } from './modules/haven-ai-agent/assistants.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.env.${process.env.NODE_ENV}`,
      isGlobal: true,
    }),
    DevtoolsModule.register({
      http:
        process.env.NODE_ENV !== 'production' &&
        process.env.NODE_ENV !== 'test',
    }),
    DatabaseModule,
    AssistantsModule,
  ],
  controllers: [AppController],
  providers: [AppService, { provide: APP_PIPE, useClass: ValidationPipe }],
})
export class AppModule {}

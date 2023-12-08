import { Module, ValidationPipe } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './modules/database/database.module';
import { DevtoolsModule } from '@nestjs/devtools-integration';
import { APP_PIPE } from '@nestjs/core';
import { PromptCreatorModule } from './modules/prompt-creator/prompt-creator.module';
import { HavenAiAgentModule } from './modules/haven-ai-agent/haven-ai-agent.module';

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
    HavenAiAgentModule,
    PromptCreatorModule,
  ],
  controllers: [AppController],
  providers: [AppService, { provide: APP_PIPE, useClass: ValidationPipe }],
})
export class AppModule {}

import { APP_PIPE } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { DevtoolsModule } from '@nestjs/devtools-integration';
import { HavenAiAgentModule } from './modules/haven-ai-agent/haven-ai-agent.module';
import { Module, ValidationPipe } from '@nestjs/common';

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
    HavenAiAgentModule,
  ],
  providers: [{ provide: APP_PIPE, useClass: ValidationPipe }],
})
export class AppModule {}

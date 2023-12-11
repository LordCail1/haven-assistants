import { APP_PIPE } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { DevtoolsModule } from '@nestjs/devtools-integration';
import { HavenAiAgentModule } from './modules/haven-ai-agent/haven-ai-agent.module';
import { Module, ValidationPipe } from '@nestjs/common';
import { DatabaseModule } from './modules/database/database.module';
import { HelpersModule } from './modules/helpers/helpers.module';

@Module({
  imports: [
    DatabaseModule,
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
    HelpersModule,
  ],
  controllers: [AppController],
  providers: [AppService, { provide: APP_PIPE, useClass: ValidationPipe }],
})
export class AppModule {}

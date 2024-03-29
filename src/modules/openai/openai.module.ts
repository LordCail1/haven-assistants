import { Module } from '@nestjs/common';
import { OpenaiAssistantsService } from './services/assistants/openai.assistants.service';
import { OpenaiThreadsService } from './services/threads/openai.threads.service';
import { OpenaiMessagesService } from './services/messages/openai.messages.service';
import { OpenaiRunsService } from './services/runs/openai.runs.service';
import OpenAI from 'openai';
import { ConfigService } from '@nestjs/config';
import { openai_key, organization_id } from 'src/shared/constants';
import { LoggerModule } from '../logger/logger.module';

/**
 * This module warps the OpenAI API
 */
@Module({
  imports: [LoggerModule],
  providers: [
    OpenaiAssistantsService,
    OpenaiMessagesService,
    OpenaiRunsService,
    OpenaiThreadsService,
    {
      provide: OpenAI,
      useFactory: (configService: ConfigService) => {
        return new OpenAI({
          apiKey: configService.get<string>(openai_key),
          organization:
            process.env.NODE_ENV === 'production'
              ? configService.get<string>(organization_id)
              : undefined,
        });
      },
      inject: [ConfigService],
    },
  ],
  exports: [
    OpenaiAssistantsService,
    OpenaiMessagesService,
    OpenaiRunsService,
    OpenaiThreadsService,
  ],
})
export class OpenaiModule {}

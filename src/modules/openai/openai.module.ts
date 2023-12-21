import { Module } from '@nestjs/common';
import { OpenaiAssistantsService } from './services/assistants/openai.assistants.service';
import { OpenaiThreadsService } from './services/threads/openai.threads.service';
import { OpenaiMessagesService } from './services/messages/openai.messages.service';
import { OpenaiRunsService } from './services/runs/openai.runs.service';
import OpenAI from 'openai';
import { ConfigService } from '@nestjs/config';
import { openai_key } from 'src/shared/constants';

/**
 * This module warps the OpenAI API
 */
@Module({
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

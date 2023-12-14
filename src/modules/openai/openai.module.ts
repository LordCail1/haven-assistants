import { Module } from '@nestjs/common';
import { OpenaiAssistantsService } from './services/assistants/openai.assistants.service';
import { OpenaiThreadsService } from './services/threads/openai.threads.service';
import { OpenaiMessagesService } from './services/messages/openai.messages.service';
import { OpenaiRunsService } from './services/runs/openai.runs.service';

/**
 * This module warps the OpenAI API
 */
@Module({
  providers: [
    OpenaiAssistantsService,
    OpenaiMessagesService,
    OpenaiRunsService,
    OpenaiThreadsService,
  ],
  exports: [
    OpenaiAssistantsService,
    OpenaiMessagesService,
    OpenaiRunsService,
    OpenaiThreadsService,
  ],
})
export class OpenaiModule {}

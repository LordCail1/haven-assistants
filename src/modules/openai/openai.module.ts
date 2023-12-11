import { Module } from '@nestjs/common';
import { OpenaiAssistantsService } from './services/openai.assistants.service';
import { OpenaiThreadsService } from './services/openai.threads.service';
import { OpenaiMessagesService } from './services/openai.messages.service';
import { OpenaiRunsService } from './services/openai.runs.service';

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

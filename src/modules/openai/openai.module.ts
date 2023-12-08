import { Module } from '@nestjs/common';
import { OpenaiAssistantsService } from './services/openai.assistants.service';
import { OpenaiMessagesService } from './services/openai.messages.service';
import { OpenaiRunsService } from './services/openai.runs.service';
import { OpenaiThreadsService } from './services/openai.threads.service';

@Module({
  providers: [
    OpenaiAssistantsService,
    OpenaiMessagesService,
    OpenaiRunsService,
    OpenaiThreadsService,
  ],
  exports: [OpenaiThreadsService, OpenaiMessagesService, OpenaiRunsService],
})
export class OpenaiModule {}

import { Module } from '@nestjs/common';
import { OpenaiService } from './services/openai.service';
import { OpenaiQuestionerService } from './services/assistants/openai.questioner.service';
import { OpenaiTerminatorService } from './services/assistants/openai.terminator.service';
import { OpenaiAssistantsService } from './services/api/openai.assistants.service';
import { OpenaiMessagesService } from './services/api/openai.messages.service';
import { OpenaiRunsService } from './services/api/openai.runs.service';
import { OpenaiThreadsService } from './services/api/openai.threads.service';

@Module({
  providers: [
    OpenaiAssistantsService,
    OpenaiMessagesService,
    OpenaiQuestionerService,
    OpenaiRunsService,
    OpenaiService,
    OpenaiTerminatorService,
    OpenaiThreadsService,
  ],
  exports: [OpenaiService],
})
export class OpenaiModule {
  constructor(
    private readonly openaiQuestionerService: OpenaiQuestionerService,
    private readonly openaiTerminatorService: OpenaiTerminatorService,
  ) {}
  async onModuleInit() {
    // await this.openaiQuestionerService.createAssistant();
    // await this.openaiTerminatorService.createAssistant();
  }
}

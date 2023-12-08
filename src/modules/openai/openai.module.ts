import { AssistantsQuestionerService } from '../assistants/services/assistants.questioner.service';
import { AssistantsTerminatorService } from '../assistants/services/assistants.terminator.service';
import { Module } from '@nestjs/common';
import { OpenaiAssistantsService } from './services/api/openai.assistants.service';
import { OpenaiMessagesService } from './services/api/openai.messages.service';
import { OpenaiRunsService } from './services/api/openai.runs.service';
import { OpenaiService } from './services/openai.service';
import { OpenaiThreadsService } from './services/api/openai.threads.service';
import { AssistantsModule } from '../assistants/assistants.module';

@Module({
  imports: [AssistantsModule],
  providers: [
    OpenaiAssistantsService,
    OpenaiMessagesService,
    OpenaiRunsService,
    OpenaiService,
    OpenaiThreadsService,
  ],
  exports: [OpenaiService],
})
export class OpenaiModule {
  constructor(
    private readonly assistantsQuestionerService: AssistantsQuestionerService,
    private readonly assistantsTerminatorService: AssistantsTerminatorService,
  ) {}
  async onModuleInit() {
    // await this.openaiQuestionerService.createAssistant();
    // await this.assistantsTerminatorService.createAssistant();
  }
}

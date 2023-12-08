import { AssistantsQuestionerService } from './services/questioner/assistants.questioner.service';
import { AssistantsRefugeeService } from './services/refugee/assistants.refugee.service';
import { AssistantsSummarizerService } from './services/summarizer/assistants.summarizer.service';
import { AssistantsTerminatorService } from './services/terminator/assistants.terminator.service';
import { Module } from '@nestjs/common';
/**
 * This module is responsible for managing the assistants that are created in OpenAI.
 */
@Module({
  providers: [
    AssistantsQuestionerService,
    AssistantsTerminatorService,
    AssistantsSummarizerService,
    AssistantsRefugeeService,
  ],
  exports: [
    AssistantsQuestionerService,
    AssistantsTerminatorService,
    AssistantsSummarizerService,
    AssistantsRefugeeService,
  ],
})
export class AssistantsModule {
  constructor(
    private readonly assistantsQuestionerService: AssistantsQuestionerService,
    private readonly assistantsTerminatorService: AssistantsTerminatorService,
    private readonly assistantsSummarizerService: AssistantsSummarizerService,
    private readonly assistantsRefugeeService: AssistantsRefugeeService,
  ) {}
  async onModuleInit() {
    await this.assistantsQuestionerService.createAssistant();
    await this.assistantsTerminatorService.createAssistant();
    await this.assistantsSummarizerService.createAssistant();
    await this.assistantsRefugeeService.createAssistant();
  }
}

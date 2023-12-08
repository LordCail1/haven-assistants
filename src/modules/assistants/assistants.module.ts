import { Module } from '@nestjs/common';
import { AssistantsQuestionerService } from './services/assistants.questioner.service';
import { AssistantsTerminatorService } from './services/assistants.terminator.service';
import { OpenaiModule } from '../openai/openai.module';
/**
 * This module is responsible for managing the assistants that are created in OpenAI.
 */
@Module({
  imports: [OpenaiModule],
  providers: [AssistantsQuestionerService, AssistantsTerminatorService],
  exports: [AssistantsQuestionerService, AssistantsTerminatorService],
})
export class AssistantsModule {}

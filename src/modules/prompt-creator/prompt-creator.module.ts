import { Module } from '@nestjs/common';
import { PromptCreatorService } from './services/prompt-creator.service';

/**
 * This module is responsible for creating prompts for the openAI API that has the right format.
 */
@Module({
  providers: [PromptCreatorService],
  exports: [PromptCreatorService],
})
export class PromptCreatorModule {}

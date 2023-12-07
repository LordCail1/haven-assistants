import { Module } from '@nestjs/common';
import { PromptCreatorService } from './services/prompt-creator.service';

@Module({
  providers: [PromptCreatorService],
  exports: [PromptCreatorService],
})
export class PromptCreatorModule {}

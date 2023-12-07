import { GenerateFirstQuestionDto } from '../dto/generate-first-question.dto';
import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { OpenaiService } from 'src/modules/openai/services/openai.service';
import { PromptCreatorService } from 'src/modules/prompt-creator/services/prompt-creator.service';
import { Thread } from 'src/modules/openai/types/types';
import { GenerateFollowUpQuestionDto } from '../dto/generate-followup-question.dto';
import { Run } from 'openai/resources/beta/threads/runs/runs';

@Injectable()
export class HavenAiAgentService {
  constructor(
    private readonly promptCreatorService: PromptCreatorService,
    @Inject(forwardRef(() => OpenaiService))
    private readonly openaiService: OpenaiService,
  ) {}

  async generateFirstQuestion(
    generateFirstQuestionDto: GenerateFirstQuestionDto,
  ) {
    const thread: Thread = await this.openaiService.createConversation();
    const firstPrompt = this.promptCreatorService.createFirstPrompt(
      generateFirstQuestionDto,
    );

    const message = await this.openaiService.createFirstMessage(
      thread.id,
      firstPrompt,
    );

    const run: Run = await this.openaiService.runThead(thread.id);
  }

  async generateFollowUpQuestion(
    generateFollowUpQuestionDto: GenerateFollowUpQuestionDto,
  ) {
    return 'success';
  }
}

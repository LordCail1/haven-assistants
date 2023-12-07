import { Injectable } from '@nestjs/common';
import { CreateQuestionDto } from '../dto/create-question.dto';
import { OpenaiService } from 'src/modules/openai/services/openai.service';
import { PromptCreatorService } from 'src/modules/prompt-creator/services/prompt-creator.service';

@Injectable()
export class HavenAiAgentService {
  constructor(
    private readonly openaiService: OpenaiService,
    private readonly promptCreatorService: PromptCreatorService,
  ) {}
  async createQuestion(
    createFirstQuestionDto: CreateQuestionDto,
  ): Promise<string> {
    this.promptCreatorService.createQuestionPrompt(createFirstQuestionDto);
    return 'success!';
  }
}

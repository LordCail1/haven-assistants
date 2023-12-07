import { CreateQuestionDto } from 'src/modules/haven-ai-agent/dto/create-question.dto';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PromptCreatorService {
  createQuestionPrompt(createQuestionDto: CreateQuestionDto) {}
}

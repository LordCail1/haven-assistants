import { Injectable } from '@nestjs/common';
import { CreateFirstQuestionDto } from '../dto/create-first-question.dto';
import { OpenaiService } from 'src/modules/openai/services/openai.service';

@Injectable()
export class AssistantsService {
  constructor(openaiService: OpenaiService) {}
  async createFirstQuestion(createFirstQuestionDto: CreateFirstQuestionDto) {
    return createFirstQuestionDto;
  }
}

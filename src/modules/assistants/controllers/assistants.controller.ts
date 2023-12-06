import { Body, Controller, Post } from '@nestjs/common';
import { CreateFirstQuestionDto } from '../dto/create-first-question.dto';
import { AssistantsService } from '../services/assistants.service';

@Controller('api/v1/assistants')
export class AssistantsController {
  constructor(private readonly assistantsService: AssistantsService) {}
  @Post('create-first-question')
  createFirstQuestion(@Body() createFirstQuestionDto: CreateFirstQuestionDto) {
    return this.assistantsService.createFirstQuestion(createFirstQuestionDto);
  }
}

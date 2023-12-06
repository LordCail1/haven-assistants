import { Body, Controller, Post } from '@nestjs/common';
import { CreateFirstQuestionDto } from '../dto/create-first-question.dto';
import { HavenAiAgentService } from '../services/haven-ai-agent.service';

@Controller('api/v1/haven-ai-agent')
export class AssistantsController {
  constructor(private readonly havenAiAgentService: HavenAiAgentService) {}
  @Post('create-first-question')
  createFirstQuestion(@Body() createFirstQuestionDto: CreateFirstQuestionDto) {
    return this.havenAiAgentService.createFirstQuestion(createFirstQuestionDto);
  }
}

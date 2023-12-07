import { Body, Controller, Post } from '@nestjs/common';
import { CreateQuestionDto } from '../dto/create-question.dto';
import { HavenAiAgentService } from '../services/haven-ai-agent.service';

@Controller('api/v1/haven-ai-agent')
export class AssistantsController {
  constructor(private readonly havenAiAgentService: HavenAiAgentService) {}
  @Post('create-question')
  createQuestion(@Body() createQuestionDto: CreateQuestionDto) {
    return this.havenAiAgentService.createQuestion(createQuestionDto);
  }
}

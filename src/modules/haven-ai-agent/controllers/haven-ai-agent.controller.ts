import { Body, Controller, Post } from '@nestjs/common';
import { GenerateFirstQuestionDto } from '../dto/generate-first-question.dto';
import { HavenAiAgentService } from '../services/haven-ai-agent.service';
import { GenerateFollowUpQuestionDto } from '../dto/generate-followup-question.dto';

@Controller('api/v1/haven-ai-agent')
export class AssistantsController {
  constructor(private readonly havenAiAgentService: HavenAiAgentService) {}
  @Post('generate-first-question')
  generateFirstQuestion(
    @Body() generateFirstQuestionDto: GenerateFirstQuestionDto,
  ) {
    return this.havenAiAgentService.generateFirstQuestion(
      generateFirstQuestionDto,
    );
  }

  @Post('generate-follow-up-question')
  generateFollowUpQuestion(
    @Body() generateFollowUpQuestionDto: GenerateFollowUpQuestionDto,
  ) {
    return this.havenAiAgentService.generateFollowUpQuestion(
      generateFollowUpQuestionDto,
    );
  }
}

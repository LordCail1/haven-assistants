import { Body, Controller, Post } from '@nestjs/common';
import { GenerateFirstQuestionDto } from '../dto/generate-first-question.dto';
import { GenerateFollowUpQuestionDto } from '../dto/generate-followup-question.dto';
import { HavenAiAgentService } from '../services/haven-ai-agent.service';
import { ResponseObject } from '../interfaces/interfaces';

@Controller('api/v1/haven-ai-agent')
export class HavenAiAgentController {
  constructor(private readonly havenAiAgentService: HavenAiAgentService) {}
  @Post('generate-first-question')
  generateFirstQuestion(
    @Body() generateFirstQuestionDto: GenerateFirstQuestionDto,
  ): Promise<ResponseObject> {
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

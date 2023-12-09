import { Body, Controller, Get, Post } from '@nestjs/common';
import { GenerateFirstQuestionDto } from '../dto/generate-first-question.dto';
import { HavenAiAgentService } from '../services/haven-ai-agent.service';
import { GenerateFollowUpQuestionDto } from '../dto/generate-followup-question.dto';
import { ThreadMessage } from 'openai/resources/beta/threads/messages/messages';

@Controller('api/v1/haven-ai-agent')
export class HavenAiAgentController {
  constructor(private readonly havenAiAgentService: HavenAiAgentService) {}
  @Post('generate-first-question')
  generateFirstQuestion(
    @Body() generateFirstQuestionDto: GenerateFirstQuestionDto,
  ): Promise<ThreadMessage[]> {
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

  @Get('get-all-messages')
  getAllMessages() {}
}

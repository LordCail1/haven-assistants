import { Body, Controller, Post } from '@nestjs/common';
import { GenerateFirstQuestionDto } from '../dto/generate-first-question.dto';
import { GenerateFollowUpQuestionDto } from '../dto/generate-followup-question.dto';
import { HavenAiAgentService } from '../services/haven-ai-agent.service';
import { ResponseObject } from '../interfaces/interfaces';

/**
 * This controller is responsible for managing the Haven AI agent.
 * It orchestrates the behavior of multiple assistants.
 */
@Controller('api/v1/haven-ai-agent')
export class HavenAiAgentController {
  constructor(private readonly havenAiAgentService: HavenAiAgentService) {}
  /**
   * This method is responsible for generating the first question that will be sent to the AI assistant.
   * @param generateFirstQuestionDto The DTO that contains the information that the refugee provided.
   * @returns The first question in the correct format
   */
  @Post('generate-first-question')
  generateFirstQuestion(
    @Body() generateFirstQuestionDto: GenerateFirstQuestionDto,
  ): Promise<ResponseObject> {
    return this.havenAiAgentService.generateFirstQuestion(
      generateFirstQuestionDto,
    );
  }

  /**
   * This method is responsible for generating the follow up question that will be sent to the AI assistant.
   * @param generateFollowUpQuestionDto The DTO that contains the information that the refugee provided.
   * @returns The follow up question in the correct format
   */
  @Post('generate-follow-up-question')
  generateFollowUpQuestion(
    @Body() generateFollowUpQuestionDto: GenerateFollowUpQuestionDto,
  ) {
    return this.havenAiAgentService.generateFollowUpQuestion(
      generateFollowUpQuestionDto,
    );
  }
}

import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { Assistant } from '../../types/types';
import { OpenaiService } from '../openai.service';
import { AssistantName, Gpt_Models } from '../enums/enums';

@Injectable()
export class OpenaiQuestionerService {
  private assistant: Assistant;
  constructor(
    @Inject(forwardRef(() => OpenaiService))
    private readonly openaiService: OpenaiService,
  ) {}

  async createAssistant() {
    try {
      this.assistant = await this.openaiService
        .getOpenaiInstance()
        .beta.assistants.create({
          name: AssistantName.QUESTIONER,
          description: 'I ask questions to refugees',
          model: Gpt_Models.GPT_4_TURBO_1106_PREVIEW,
        });
    } catch (error) {
      console.log(
        'something went wrong creating the questioner assistant',
        error,
      );
    }
  }

  getAssistantInstance() {
    return this.assistant;
  }
}

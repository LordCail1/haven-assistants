import { Assistant } from '../../openai/types/types';
import { AssistantName, Gpt_Models } from '../../openai/services/enums/enums';
import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { OpenaiService } from '../../openai/services/openai.service';

@Injectable()
export class AssistantsQuestionerService {
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

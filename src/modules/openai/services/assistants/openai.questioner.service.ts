import { Injectable } from '@nestjs/common';
import { Assistant } from '../../types/types';
import { OpenaiService } from '../openai.service';

@Injectable()
export class OpenaiQuestionerService {
  private assistant: Assistant;
  constructor(private readonly openaiService: OpenaiService) {}

  async createAssistant() {
    try {
      this.assistant = await this.openaiService
        .getOpenaiInstance()
        .beta.assistants.create({
          name: 'Questioner',
          description: 'I ask questions to refugees',
          model: 'gpt-4-1106-preview',
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

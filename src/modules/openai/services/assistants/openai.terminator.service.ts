import { Assistant } from '../../types/types';
import { Injectable } from '@nestjs/common';
import { OpenaiService } from '../openai.service';

@Injectable()
export class OpenaiTerminatorService {
  private assistant: Assistant;
  constructor(private readonly openaiService: OpenaiService) {}

  async createAssistant() {
    try {
      this.assistant = await this.openaiService
        .getOpenaiInstance()
        .beta.assistants.create({
          name: 'Thread Terminator',
          description:
            'analyze the conversation and judge if it is necessary to continue asking questions or terminate it',
          model: 'gpt-4-1106-preview',
        });
    } catch (error) {
      console.log(
        'something went wrong creating the questioner assistant',
        error,
      );
    }
  }
}

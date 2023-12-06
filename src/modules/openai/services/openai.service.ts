import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import { IOpenaiService } from '../interfaces/interfaces';
import { openai_key } from 'src/shared/constants';
import OpenAI from 'openai';

@Injectable()
export class OpenaiService implements IOpenaiService {
  private assistant: OpenAI.Beta.Assistants.Assistant;
  private openai: OpenAI = new OpenAI({
    apiKey: this.configService.get<string>(openai_key),
  });
  private thread: OpenAI.Beta.Threads.Thread;

  constructor(private configService: ConfigService) {}

  async listAssistants(): Promise<OpenAI.Beta.Assistants.AssistantsPage> {
    const listOfAssistants = await this.openai.beta.assistants.list();
    return listOfAssistants;
  }

  async createThread(): Promise<void> {
    try {
      this.thread = await this.openai.beta.threads.create();
    } catch (error) {
      console.log('there was an error!', error);
    }
  }

  async addMessageToThread(message: string): Promise<void> {}
}

import { ConfigService } from '@nestjs/config';
import { CreateAssistantDto } from '../dto/openai.dto';
import { Injectable } from '@nestjs/common';
import { IOpenaiService } from '../interfaces/interfaces';
import OpenAI from 'openai';

@Injectable()
export class OpenaiService implements IOpenaiService {
  private assistant: OpenAI.Beta.Assistants.Assistant;
  private openai: OpenAI = new OpenAI({
    apiKey: this.configService.get<string>('OPENAI_KEY'),
  });

  constructor(private configService: ConfigService) {}

  async createAssistant(
    createAssistantDto: CreateAssistantDto,
  ): Promise<OpenAI.Beta.Assistants.Assistant> {
    const { description, instructions, model, name, tools } =
      createAssistantDto;

    try {
      this.assistant = await this.openai.beta.assistants.create({
        description,
        instructions,
        model,
        name,
        tools,
      });
    } catch (error) {
      console.log('there was an error!', error);
    }
    return this.assistant;
  }

  async listAssistants(): Promise<void> {
    return null;
  }

  async createThread(): Promise<OpenAI.Beta.Threads.Thread> {
    try {
      const thread = await this.openai.beta.threads.create();
      return thread;
    } catch (error) {
      console.log('there was an error!', error);
    }
  }
}

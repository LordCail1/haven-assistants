import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';
import { APIPromise } from 'openai/core';

@Injectable()
export class OpenaiService {
  constructor(private configService: ConfigService) {}

  async createAssistant(): Promise<
    APIPromise<OpenAI.Beta.Assistants.Assistant>
  > {
    let assistant: APIPromise<OpenAI.Beta.Assistants.Assistant>;
    try {
      const openai = new OpenAI({
        apiKey: this.configService.get<string>('OPENAI_KEY'),
      });
      assistant = openai.beta.assistants.create({
        name: 'First Assistant',
        instructions:
          'you are a clown! answer like a clown when we talk to you.',
        tools: [{ type: 'code_interpreter' }],
        model: 'gpt-4-1106-preview',
      });
    } catch (error) {
      console.log('there was an error!', error);
    }
    return assistant;
  }
}

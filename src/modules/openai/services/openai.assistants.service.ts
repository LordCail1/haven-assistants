import {
  Assistant,
  AssistantCreateParams,
  AssistantDeleted,
  AssistantsPage,
} from 'openai/resources/beta/assistants/assistants';
import { ConfigService } from '@nestjs/config';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { openai_key } from 'src/shared/constants';
import OpenAI from 'openai';

/**
 * This service is responsible for interacting with the OpenAI assistants API
 * https://platform.openai.com/docs/api-reference/assistants
 */
@Injectable()
export class OpenaiAssistantsService {
  private openai: OpenAI = new OpenAI({
    apiKey: this.configService.get<string>(openai_key),
  });

  constructor(private readonly configService: ConfigService) {}

  async listAllAssistants(): Promise<AssistantsPage> {
    try {
      return this.openai.beta.assistants.list();
    } catch (error) {
      throw new HttpException(
        {
          message: 'Something went wrong listing all the assistants',
          error,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async createAssistant(
    assistantCreateParams: AssistantCreateParams,
  ): Promise<Assistant> {
    try {
      return this.openai.beta.assistants.create(assistantCreateParams);
    } catch (error) {
      throw new HttpException(
        {
          message: `Something went wrong creating the assistant ${assistantCreateParams.name}`,
          error,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async deleteAssistant(assistantId: string): Promise<AssistantDeleted> {
    return this.openai.beta.assistants.del(assistantId);
  }
}

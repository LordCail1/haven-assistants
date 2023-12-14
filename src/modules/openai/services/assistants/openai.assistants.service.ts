import {
  AssistantsPage,
  AssistantCreateParams,
  Assistant,
  AssistantDeleted,
} from 'openai/resources/beta/assistants/assistants';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { OpenaiAbstractService } from '../openai.abstract.service';

/**
 * This service is responsible for interacting with the OpenAI assistants API
 * https://platform.openai.com/docs/api-reference/assistants
 */
@Injectable()
export class OpenaiAssistantsService extends OpenaiAbstractService {
  /**
   * This method is responsible for listing all the assistants
   * @returns An array of assistants
   */
  async listAllAssistants(): Promise<AssistantsPage> {
    try {
      return await this.openai.beta.assistants.list();
    } catch (error) {
      throw new HttpException(
        'Something went wrong listing all the assistants',
        HttpStatus.INTERNAL_SERVER_ERROR,
        { cause: error },
      );
    }
  }

  /**
   * This method is responsible for creating a new assistant
   * @param assistantCreateParams The assistant create params
   * @returns The assistant object
   */
  async createAssistant(
    assistantCreateParams: AssistantCreateParams,
  ): Promise<Assistant> {
    try {
      return await this.openai.beta.assistants.create(assistantCreateParams);
    } catch (error) {
      throw new HttpException(
        `Something went wrong creating the assistant ${assistantCreateParams.name}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
        { cause: error },
      );
    }
  }

  /**
   * This method is responsible for deleting an assistant
   * @param assistantId The assistant id
   * @returns The assistant deleted object
   */
  async deleteAssistant(assistantId: string): Promise<AssistantDeleted> {
    try {
      return await this.openai.beta.assistants.del(assistantId);
    } catch (error) {
      throw new HttpException(
        'Something went wrong deleting the assistant',
        HttpStatus.INTERNAL_SERVER_ERROR,
        { cause: error },
      );
    }
  }
}

import {
  AssistantsPage,
  AssistantCreateParams,
  Assistant,
  AssistantDeleted,
} from 'openai/resources/beta/assistants/assistants';
import { CreateAssistantException } from '../../exceptions/assistants/create-assistant.exception';
import { DeleteAssistantException } from '../../exceptions/assistants/delete-assistant.exception';
import { Injectable } from '@nestjs/common';
import { ListAllAssistantsException } from '../../exceptions/assistants/list-all-assistants.exception';
import OpenAI from 'openai';

/**
 * This service is responsible for interacting with the OpenAI assistants API
 * https://platform.openai.com/docs/api-reference/assistants
 */
@Injectable()
export class OpenaiAssistantsService {
  constructor(private openai: OpenAI) {}

  /**
   * This method is responsible for listing all the assistants
   * @returns An array of assistants
   */
  async listAllAssistants(): Promise<AssistantsPage> {
    try {
      return await this.openai.beta.assistants.list();
    } catch (error) {
      throw new ListAllAssistantsException(error);
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
      throw new CreateAssistantException(error);
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
      throw new DeleteAssistantException(assistantId, error);
    }
  }
}

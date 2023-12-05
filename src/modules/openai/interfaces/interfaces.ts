import OpenAI from 'openai';
import { AssistantCreateParams } from 'openai/resources/beta/assistants/assistants';
import { CreateAssistantDto } from '../dto/openai.dto';

/**
 * this interface is used to extend the already-existing AssistantCreateParams interface
 * and add the model property to it being a string union.
 */
export interface MyAssistantCreateParams extends AssistantCreateParams {
  model: 'gpt-4-1106-preview';
}

/**
 * This controller is used to manipulate the OpenAI API
 */
export interface IOpenaiController {
  createAssistant(
    createAssistantDto: CreateAssistantDto,
  ): Promise<OpenAI.Beta.Assistants.Assistant>;
  createThread(): Promise<OpenAI.Beta.Threads.Thread>;
}

/**
 * This service is used to manipulate the OpenAI API
 */
export interface IOpenaiService {
  createAssistant(
    createAssistantDto: MyAssistantCreateParams,
  ): Promise<OpenAI.Beta.Assistants.Assistant>;

  listAssistants(): Promise<void>;
  createThread(): Promise<OpenAI.Beta.Threads.Thread>;
}

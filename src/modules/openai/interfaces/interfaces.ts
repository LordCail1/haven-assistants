import { AssistantCreateParams } from 'openai/resources/beta/assistants/assistants';
import { CreateFirstQuestionDto } from '../../assistants/dto/create-first-question.dto';
import OpenAI from 'openai';
import { CreateAssistantDto } from '../dto/create-assistant.dto';

/**
 * this interface is used to extend the already-existing AssistantCreateParams interface
 * and add the model property to it being a string union.
 */
export interface MyAssistantCreateParams extends AssistantCreateParams {
  model: 'gpt-4-1106-preview';
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

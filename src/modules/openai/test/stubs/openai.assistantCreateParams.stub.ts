import { AssistantCreateParams } from 'openai/resources/beta/assistants';
import { Gpt_Models } from '../../enums/enums';

/**
 * This stub is responsible for creating an assistant create params stub object
 * @returns An assistant create params object
 */
export const assistantCreateParamsStub = (): AssistantCreateParams => {
  return {
    name: 'test',
    model: Gpt_Models.GPT_VERSION,
    description: 'test',
    metadata: null,
    response_format: null,
    temperature: null,
    tool_resources: null,
    tools: null,
    top_p: null,
    instructions: 'test',
  };
};

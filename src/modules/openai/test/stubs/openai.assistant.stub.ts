import { v4 as uuid } from 'uuid';
import { Gpt_Models } from '../../enums/enums';
import { Assistant } from 'openai/resources/beta/assistants';

/**
 * This stub is responsible for creating an assistant stub object
 * @returns An assistant object
 */
export const assistantStub = (): Assistant => {
  return {
    id: uuid(),
    created_at: new Date().getTime(),
    description: 'random description',
    response_format: null,
    temperature: null,
    tool_resources: null,
    top_p: null,
    instructions: null,
    metadata: null,
    model: Gpt_Models.GPT_VERSION,
    name: 'random assistant',
    object: 'assistant',
    tools: [],
  };
};

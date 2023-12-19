import { Assistant } from 'openai/resources/beta/assistants/assistants';
import { v4 as uuid } from 'uuid';
import { Gpt_Models } from '../../enums/enums';

/**
 * This stub is responsible for creating an assistant stub object
 * @returns An assistant object
 */
export const assistantStub = (): Assistant => {
  return {
    id: uuid(),
    created_at: new Date().getTime(),
    description: 'random description',
    file_ids: ['test'],
    instructions: null,
    metadata: null,
    model: Gpt_Models.GPT_4_TURBO_1106_PREVIEW,
    name: 'random assistant',
    object: 'assistant',
    tools: [],
  };
};

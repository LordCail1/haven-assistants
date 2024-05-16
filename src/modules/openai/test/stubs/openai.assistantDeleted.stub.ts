import { AssistantDeleted } from 'openai/resources/beta/assistants';
import { v4 as uuid } from 'uuid';

/**
 * This stub is responsible for creating an assistant deleted stub object
 * @returns An assistant deleted object
 */
export const assistantDeletedStub = (): AssistantDeleted => {
  return {
    id: uuid(),
    object: 'assistant.deleted',
    deleted: true,
  };
};

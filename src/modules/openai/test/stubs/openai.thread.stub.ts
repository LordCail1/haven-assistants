import { Thread } from 'openai/resources/beta/threads/threads';
import { v4 as uuid } from 'uuid';

/**
 * returns a thread stub
 * @returns a thread stub
 */
export const threadStub = (): Thread => {
  return {
    id: uuid(),
    created_at: new Date().getTime(),
    object: 'thread',
    metadata: null,
  };
};

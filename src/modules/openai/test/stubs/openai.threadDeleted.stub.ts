import { ThreadDeleted } from 'openai/resources/beta/threads/threads';
import { v4 as uuuid } from 'uuid';

/**
 * This stub is responsible for creating a thread deleted stub.
 * @returns a thread deleted stub
 */
export const threadDeletedStub = (): ThreadDeleted => {
  return {
    id: uuuid(),
    deleted: true,
    object: 'thread.deleted',
  };
};

import {
  MessageContentImageFile,
  MessageContentText,
  ThreadMessage,
} from 'openai/resources/beta/threads/messages/messages';
import { v4 as uuid } from 'uuid';

/**
 * returns a thread message stub
 * @param role role
 * @param content the content, depending on if it is a text or an image
 * @returns a thread message stub
 */
export const threadMessageStub = (
  role: 'user' | 'assistant',
  content: MessageContentImageFile | MessageContentText,
): ThreadMessage => {
  return {
    id: uuid(),
    assistant_id: uuid(),
    content: [content],
    created_at: new Date().getTime(),
    file_ids: ['first_id'],
    metadata: null,
    object: 'thread.message',
    role,
    run_id: uuid(),
    thread_id: uuid(),
  };
};

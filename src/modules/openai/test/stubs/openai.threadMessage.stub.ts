import OpenAI from 'openai';
import { MessageContent } from 'openai/resources/beta/threads/messages';

import { v4 as uuid } from 'uuid';

/**
 * returns a thread message stub
 * @param role role
 * @param content the content, depending on if it is a text or an image
 * @returns a thread message stub
 */
export const threadMessageStub = (
  content: MessageContent,
): OpenAI.Beta.Threads.Messages.Message => {
  return {
    id: uuid(),
    assistant_id: uuid(),
    content: [content],
    created_at: new Date().getTime(),
    attachments: null,
    completed_at: null,
    incomplete_at: null,
    incomplete_details: null,
    status: 'completed',
    metadata: null,
    object: 'thread.message',
    role: 'user',
    run_id: uuid(),
    thread_id: uuid(),
  };
};

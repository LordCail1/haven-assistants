import { ThreadMessage } from 'openai/resources/beta/threads/messages/messages';
import { v4 as uuid } from 'uuid';
/**
 * Mock of OpenaiMessagesService
 */
export const openaiMessagesServiceMock = {
  createMessage: jest.fn(),
  listMessages: jest.fn().mockImplementation((threadId: string) => {
    const threadMessage: ThreadMessage[] = [
      {
        id: uuid(),
        assistant_id: uuid(),
        content: [
          {
            text: {
              annotations: [],
              value: 'Hello, how can I help you?',
            },
            type: 'text',
          },
        ],
        created_at: new Date().getTime(),
        file_ids: [],
        metadata: null,
        object: 'thread.message',
        role: 'user',
        run_id: uuid(),
        thread_id: threadId,
      },
    ];
    return Promise.resolve(threadMessage);
  }),
};

import { MessageContent } from 'openai/resources/beta/threads/messages';

/**
 * returns a message content text stub
 * @returns a message content text stub
 */
export const messageContentTextStub = (): MessageContent => {
  return {
    text: {
      annotations: [],
      value: 'random Text',
    },
    type: 'text',
  };
};

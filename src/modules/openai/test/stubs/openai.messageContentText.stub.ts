import { MessageContentText } from 'openai/resources/beta/threads/messages/messages';

/**
 * returns a message content text stub
 * @returns a message content text stub
 */
export const messageContentTextStub = (): MessageContentText => {
  return {
    text: {
      annotations: [],
      value: 'random Text',
    },
    type: 'text',
  };
};

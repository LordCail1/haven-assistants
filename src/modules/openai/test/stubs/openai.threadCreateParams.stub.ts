import { ThreadCreateParams } from 'openai/resources/beta/threads/threads';

/**
 * returns a thread create params stub
 * @returns a thread create params stub
 */
export const threadCreateParamsStub = (): ThreadCreateParams => {
  return {
    messages: [{ content: 'Hello', role: 'user' }],
  };
};

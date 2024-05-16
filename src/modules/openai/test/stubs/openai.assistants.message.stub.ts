import { ThreadCreateParams } from 'openai/resources/beta/threads/threads';

/**
 * This stub is responsible for creating a thread create params message stub.
 * @returns a thread create params message stub
 */
export const threadCreateParamsMessageStub = (): ThreadCreateParams.Message => {
  return {
    content: 'message',
    role: 'user',
    attachments: null,
    metadata: null,
  };
};

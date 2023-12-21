/* eslint-disable @typescript-eslint/no-unused-vars */
import { ThreadMessage } from 'openai/resources/beta/threads/messages/messages';
import { ThreadCreateParams } from 'openai/resources/beta/threads/threads';
import { threadCreateParamsMessageStub } from 'src/modules/openai/test/stubs/openai.assistants.message.stub';

/**
 * Mocked helpers service
 */
export const helpersServiceMock = {
  parseLastResponseForJson: jest.fn().mockReturnValue(false),
  convertThreadMessagesToMessageArray: jest
    .fn()
    .mockImplementation(
      (threadMessages: ThreadMessage[]): ThreadCreateParams.Message[] => {
        const messages: ThreadCreateParams.Message[] = [];
        for (let i = 0; i < 2; i++) {
          messages.push(threadCreateParamsMessageStub());
        }

        return messages;
      },
    ),
};

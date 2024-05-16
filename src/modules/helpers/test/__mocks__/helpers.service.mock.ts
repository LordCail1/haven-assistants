/* eslint-disable @typescript-eslint/no-unused-vars */
import OpenAI from 'openai';
import { ThreadCreateParams } from 'openai/resources/beta/threads/threads';
import { threadCreateParamsMessageStub } from 'src/modules/openai/test/stubs/openai.assistants.message.stub';

/**
 * Mocked helpers service
 */
export const helpersServiceMock = {
  parseTerminatorResponseForJson: jest.fn().mockReturnValue(false),
  convertThreadMessagesToMessageArray: jest
    .fn()
    .mockImplementation(
      (
        threadMessages: OpenAI.Beta.Threads.Messages.Message[],
      ): ThreadCreateParams.Message[] => {
        const messages: ThreadCreateParams.Message[] = [];
        for (let i = 0; i < 2; i++) {
          messages.push(threadCreateParamsMessageStub());
        }

        return messages;
      },
    ),
};

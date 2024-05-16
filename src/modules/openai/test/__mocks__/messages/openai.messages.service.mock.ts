import OpenAI from 'openai';
import { messageContentTextStub } from '../../stubs/openai.messageContentText.stub';
import { threadMessageStub } from '../../stubs/openai.threadMessage.stub';
import { UserMessage } from 'src/shared/interfaces/interfaces';
import { MessageContent } from 'openai/resources/beta/threads/messages';
/**
 * Mock of OpenaiMessagesService
 */
export const openaiMessagesServiceMock = {
  createMessage: jest
    .fn()
    .mockImplementation((threadId: string, followUpPrompt: UserMessage) => {
      const { content, role } = followUpPrompt;
      const messageContentText: MessageContent = messageContentTextStub();
      if ('text' in messageContentText) {
        messageContentText.text.value = content;
      }
      const threadMessage: OpenAI.Beta.Threads.Messages.Message =
        threadMessageStub(messageContentText);
      threadMessage.thread_id = threadId;
      threadMessage.role = role;

      return Promise.resolve(threadMessage);
    }),
  listMessages: jest.fn().mockImplementation((threadId: string) => {
    const firstMessageContentText: MessageContent = messageContentTextStub();
    const firstThreadMessage: OpenAI.Beta.Threads.Messages.Message =
      threadMessageStub(firstMessageContentText);
    firstThreadMessage.thread_id = threadId;

    const secondMessageContentText: MessageContent = messageContentTextStub();
    const secondThreadMessage: OpenAI.Beta.Threads.Messages.Message =
      threadMessageStub(secondMessageContentText);
    secondThreadMessage.thread_id = threadId;

    return Promise.resolve([firstThreadMessage, secondThreadMessage]);
  }),
};

import {
  MessageContentText,
  ThreadMessage,
} from 'openai/resources/beta/threads/messages/messages';
import { messageContentTextStub } from '../../stubs/openai.messageContentText.stub';
import { threadMessageStub } from '../../stubs/openai.threadMessage.stub';
import { UserMessage } from 'src/shared/interfaces/interfaces';
/**
 * Mock of OpenaiMessagesService
 */
export const openaiMessagesServiceMock = {
  createMessage: jest
    .fn()
    .mockImplementation((threadId: string, followUpPrompt: UserMessage) => {
      const { content, role } = followUpPrompt;
      const messageContentText: MessageContentText = messageContentTextStub();
      messageContentText.text.value = content;

      const threadMessage: ThreadMessage =
        threadMessageStub(messageContentText);
      threadMessage.thread_id = threadId;
      threadMessage.role = role;

      return Promise.resolve(threadMessage);
    }),
  listMessages: jest.fn().mockImplementation((threadId: string) => {
    const firstMessageContentText: MessageContentText =
      messageContentTextStub();
    const firstThreadMessage: ThreadMessage = threadMessageStub(
      firstMessageContentText,
    );
    firstThreadMessage.thread_id = threadId;

    const secondMessageContentText: MessageContentText =
      messageContentTextStub();
    const secondThreadMessage: ThreadMessage = threadMessageStub(
      secondMessageContentText,
    );
    secondThreadMessage.thread_id = threadId;

    return Promise.resolve([firstThreadMessage, secondThreadMessage]);
  }),
};

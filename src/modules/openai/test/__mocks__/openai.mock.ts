/* eslint-disable @typescript-eslint/no-unused-vars */
import { Run, RunCreateParams } from 'openai/resources/beta/threads/runs/runs';
import {
  Thread,
  ThreadCreateParams,
} from 'openai/resources/beta/threads/threads';
import { v4 as uuid } from 'uuid';
import { Gpt_Models } from '../../enums/enums';
import {
  MessageContentText,
  MessageCreateParams,
  ThreadMessage,
} from 'openai/resources/beta/threads/messages/messages';
import {
  Assistant,
  AssistantCreateParams,
  AssistantDeleted,
} from 'openai/resources/beta/assistants/assistants';
import { threadStub } from '../stubs/openai.thread.stub';
import { runStub } from '../stubs/openai.run.stub';
import { messageContentTextStub } from '../stubs/openai.messageContentText.stub';
import { threadMessageStub } from '../stubs/openai.threadMessage.stub';

/**
 * This mock is responsible for mocking the openAI API.
 */
export const openaiMock = {
  beta: {
    threads: {
      create: jest
        .fn()
        .mockImplementation((threadCreateParams: ThreadCreateParams) => {
          const thread: Thread = threadStub();

          return Promise.resolve(thread);
        }),
      runs: {
        create: jest
          .fn()
          .mockImplementation(
            (threadId: string, runCreateParams: RunCreateParams) => {
              const { assistant_id } = runCreateParams;

              const run = runStub();
              run.status = 'completed';
              run.thread_id = threadId;
              run.assistant_id = assistant_id;

              return Promise.resolve(run);
            },
          ),
        retrieve: jest
          .fn()
          .mockImplementation((threadId: string, runId: string) => {
            const run = runStub();
            run.status = 'completed';
            run.thread_id = threadId;
            return Promise.resolve(run);
          }),
      },

      messages: {
        create: jest
          .fn()
          .mockImplementation(
            (threadId: string, messageCreateParams: MessageCreateParams) => {
              const messageContentText: MessageContentText =
                messageContentTextStub();
              messageContentText.text.value = messageCreateParams.content;

              const threadMessage: ThreadMessage =
                threadMessageStub(messageContentText);

              threadMessage.content = [messageContentText];
              threadMessage.role = messageCreateParams.role;
              threadMessage.thread_id = threadId;

              return Promise.resolve(threadMessage);
            },
          ),
        list: jest.fn().mockImplementation((threadId: string) => {
          const threadMessage = threadMessageStub(messageContentTextStub());
          threadMessage.thread_id = threadId;

          return Promise.resolve({ data: [threadMessage] });
        }),
      },
    },
    assistants: {
      list: jest
        .fn()
        .mockImplementation((assistantCreateParams: AssistantCreateParams) => {
          const assistant: Assistant = {
            created_at: new Date().getTime(),
            description: 'random instructions',
            file_ids: [],
            id: uuid(),
            instructions: '',
            metadata: null,
            model: Gpt_Models.GPT_4_TURBO_1106_PREVIEW,
            name: 'random assistant',
            object: 'assistant',
            tools: [],
          };

          return Promise.resolve({ data: [assistant] });
        }),
      create: jest
        .fn()
        .mockImplementation((assistantCreateParams: AssistantCreateParams) => {
          const {
            model,
            description,
            file_ids,
            instructions,
            metadata,
            name,
            tools,
          } = assistantCreateParams;
          const assistant: Assistant = {
            created_at: new Date().getTime(),
            description,
            file_ids,
            id: uuid(),
            instructions,
            metadata,
            model,
            name,
            object: 'assistant',
            tools,
          };

          return Promise.resolve(assistant);
        }),
      del: jest.fn().mockImplementation((assistantId: string) => {
        const assistantDeleted: AssistantDeleted = {
          deleted: false,
          id: assistantId,
          object: 'assistant.deleted',
        };

        return Promise.resolve(assistantDeleted);
      }),
    },
  },
};

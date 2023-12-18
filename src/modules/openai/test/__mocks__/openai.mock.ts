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

export const openaiMock = {
  beta: {
    threads: {
      create: jest
        .fn()
        .mockImplementation((threadCreateParams: ThreadCreateParams) => {
          const thread: Thread = {
            id: uuid(),
            created_at: new Date().getTime(),
            metadata: null,
            object: 'thread',
          };

          return Promise.resolve(thread);
        }),
      runs: {
        create: jest
          .fn()
          .mockImplementation(
            (threadId: string, runCreateParams: RunCreateParams) => {
              const { assistant_id } = runCreateParams;
              const run: Run = {
                id: uuid(),
                assistant_id,
                cancelled_at: null,
                completed_at: null,
                created_at: new Date().getTime(),
                expires_at: new Date().getTime(),
                failed_at: null,
                file_ids: [],
                instructions: 'random instructions',
                last_error: null,
                metadata: null,
                model: Gpt_Models.GPT_4_TURBO_1106_PREVIEW,
                object: 'thread.run',
                required_action: null,
                started_at: null,
                status: 'completed',
                thread_id: threadId,
                tools: [],
              };

              return Promise.resolve(run);
            },
          ),
        retrieve: jest
          .fn()
          .mockImplementation((threadId: string, runId: string) => {
            const run: Run = {
              id: uuid(),
              assistant_id: uuid(),
              cancelled_at: null,
              completed_at: null,
              created_at: new Date().getTime(),
              expires_at: new Date().getTime(),
              failed_at: null,
              file_ids: [],
              instructions: 'random instructions',
              last_error: null,
              metadata: null,
              model: Gpt_Models.GPT_4_TURBO_1106_PREVIEW,
              object: 'thread.run',
              required_action: null,
              started_at: null,
              status: 'completed',
              thread_id: threadId,
              tools: [],
            };
            return Promise.resolve(run);
          }),
      },

      messages: {
        create: jest
          .fn()
          .mockImplementation(
            (threadId: string, messageCreateParams: MessageCreateParams) => {
              const { content, role, file_ids, metadata } = messageCreateParams;
              const messageContent: MessageContentText = {
                text: {
                  value: 'random Text',
                  annotations: [],
                },
                type: 'text',
              };
              const threadMessage: ThreadMessage = {
                id: uuid(),
                assistant_id: uuid(),
                content: [messageContent],
                created_at: new Date().getTime(),
                file_ids,
                metadata,
                object: 'thread.message',
                role,
                run_id: uuid(),
                thread_id: threadId,
              };

              return Promise.resolve(threadMessage);
            },
          ),
        list: jest.fn().mockImplementation((threadId: string) => {
          const threadMessage: ThreadMessage = {
            id: uuid(),
            assistant_id: uuid(),
            content: [],
            created_at: new Date().getTime(),
            file_ids: [],
            metadata: null,
            object: 'thread.message',
            role: 'user',
            run_id: uuid(),
            thread_id: threadId,
          };

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

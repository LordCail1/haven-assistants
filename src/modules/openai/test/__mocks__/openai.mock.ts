/* eslint-disable @typescript-eslint/no-unused-vars */
import { RunCreateParams } from 'openai/resources/beta/threads/runs/runs';
import {
  Thread,
  ThreadCreateParams,
  ThreadDeleted,
} from 'openai/resources/beta/threads/threads';

import { threadStub } from '../stubs/openai.thread.stub';
import { runStub } from '../stubs/openai.run.stub';
import { messageContentTextStub } from '../stubs/openai.messageContentText.stub';
import { threadMessageStub } from '../stubs/openai.threadMessage.stub';
import { assistantStub } from '../stubs/openai.assistant.stub';
import { assistantDeletedStub } from '../stubs/openai.assistantDeleted.stub';
import { threadDeletedStub } from '../stubs/openai.threadDeleted.stub';
import OpenAI from 'openai';
import {
  MessageContent,
  MessageCreateParams,
} from 'openai/resources/beta/threads/messages';
import {
  Assistant,
  AssistantCreateParams,
} from 'openai/resources/beta/assistants';

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
              const messageContentText: MessageContent =
                messageContentTextStub();

              if (typeof messageCreateParams.content === 'string') {
                if ('text' in messageContentText) {
                  messageContentText.text.value = messageCreateParams.content;
                }
              }

              const threadMessage: OpenAI.Beta.Threads.Messages.Message =
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
      del: jest.fn().mockImplementation((threadId: string) => {
        const threadDeleted: ThreadDeleted = threadDeletedStub();
        return Promise.resolve(threadDeleted);
      }),
    },
    assistants: {
      list: jest.fn().mockImplementation(() => {
        return Promise.resolve({ data: [assistantStub()] });
      }),
      create: jest
        .fn()
        .mockImplementation((assistantCreateParams: AssistantCreateParams) => {
          const {
            description,
            instructions,
            metadata,
            model,
            name,
            response_format,
            temperature,
            tool_resources,
            tools,
            top_p,
          } = assistantCreateParams;
          const assistant: Assistant = assistantStub();
          assistant.model = model;
          assistant.description = description;
          assistant.response_format = response_format;
          assistant.temperature = temperature;
          assistant.tool_resources = tool_resources;
          assistant.top_p = top_p;
          assistant.instructions = instructions;
          assistant.metadata = metadata;
          assistant.name = name;
          assistant.tools = tools;

          return Promise.resolve(assistant);
        }),
      del: jest
        .fn()
        .mockImplementation((assistantId: string) =>
          Promise.resolve(assistantDeletedStub()),
        ),
    },
  },
};

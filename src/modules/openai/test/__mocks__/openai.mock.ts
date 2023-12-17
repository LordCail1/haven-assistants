/* eslint-disable @typescript-eslint/no-unused-vars */
import { Run, RunCreateParams } from 'openai/resources/beta/threads/runs/runs';
import {
  Thread,
  ThreadCreateParams,
} from 'openai/resources/beta/threads/threads';
import { v4 as uuid } from 'uuid';
import { Gpt_Models } from '../../enums/enums';

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
    },
  },
};

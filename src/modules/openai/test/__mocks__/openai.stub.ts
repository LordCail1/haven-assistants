/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Thread,
  ThreadCreateParams,
} from 'openai/resources/beta/threads/threads';
import { v4 as uuid } from 'uuid';

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
    },
  },
};

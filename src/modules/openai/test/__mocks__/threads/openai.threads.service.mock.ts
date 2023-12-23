/* eslint-disable @typescript-eslint/no-unused-vars */
import { Thread, ThreadDeleted } from 'openai/resources/beta/threads/threads';
import { threadStub } from '../../stubs/openai.thread.stub';
import { threadDeletedStub } from '../../stubs/openai.threadDeleted.stub';

/**
 * mocking the openaiThreadsService
 */
export const openaiThreadsServiceMock = {
  createThread: jest.fn().mockImplementation(() => {
    const thread: Thread = threadStub();
    return thread;
  }),
  deleteThread: jest.fn(),
};

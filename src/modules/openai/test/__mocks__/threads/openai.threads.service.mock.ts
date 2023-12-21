import { Thread } from 'openai/resources/beta/threads/threads';
import { threadStub } from '../../stubs/openai.thread.stub';

/**
 * mocking the openaiThreadsService
 */
export const openaiThreadsServiceMock = {
  createThread: jest.fn().mockImplementation(() => {
    const thread: Thread = threadStub();
    return thread;
  }),
};

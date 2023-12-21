import { Run } from 'openai/resources/beta/threads/runs/runs';
import { runStub } from '../../stubs/openai.run.stub';

/**
 * Mock of OpenaiRunsService
 */
export const openaiRunsServiceMock = {
  createRun: jest
    .fn()
    .mockImplementation((threadId: string, assistantId: string) => {
      const run: Run = runStub();
      run.assistant_id = assistantId;
      run.thread_id = threadId;

      return Promise.resolve(run);
    }),
  retrieveRun: jest.fn(),
};

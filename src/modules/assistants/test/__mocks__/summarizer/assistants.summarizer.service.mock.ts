/* eslint-disable @typescript-eslint/no-unused-vars */

/**
 * Mocked AssistantsSummarizerService
 */
export const assistantsSummarizerServiceMock = {
  createSummary: jest.fn().mockImplementation((threadId: string) => {
    return Promise.resolve('mocked summary');
  }),
};

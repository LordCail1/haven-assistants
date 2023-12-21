/* eslint-disable @typescript-eslint/no-unused-vars */
/**
 * Mocked AssistantsTerminatorService
 */
export const assistantsTerminatorServiceMock = {
  determineIfStoryIsGoodEnough: jest
    .fn()
    .mockImplementation((threadId: string) => {
      return Promise.resolve(false);
    }),
};

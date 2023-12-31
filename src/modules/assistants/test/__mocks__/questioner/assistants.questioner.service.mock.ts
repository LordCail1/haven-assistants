import { v4 as uuid } from 'uuid';

/**
 * Mock of the AssistantsQuestionerService
 */
export const assistantsQuestionerServiceMock = {
  getAssistant: jest.fn().mockImplementation(() => {
    const assistantId: string = uuid();
    return assistantId;
  }),
};

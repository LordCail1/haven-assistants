import { v4 as uuid } from 'uuid';

/**
 * Mock of the AssistantsLanguageSimplifierService
 */
export const assistantsLanguageSimplifierServiceMock = {
  getAssistant: jest.fn().mockImplementation(() => {
    const assistantId: string = uuid();
    return assistantId;
  }),
};

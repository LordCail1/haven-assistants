import { v4 as uuid } from 'uuid';

/**
 * Mock of the AssistantsLanguageSimplifierService
 */
export const assistantsLanguageSimplifierServiceMock = {
  getAssistant: jest.fn().mockImplementation(() => {
    const assistantId: string = uuid();
    return assistantId;
  }),
  // Mock implementation of the simplifyLanguage method
  simplifyLanguage: jest.fn().mockImplementation((summarizedText: string) => {
    // Simulate a simplification process
    return Promise.resolve(`Simplified: ${summarizedText}`);
  }),
};

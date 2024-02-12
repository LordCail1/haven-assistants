import { v4 as uuid } from 'uuid';

/**
 * Mock of the AssistantsCriteriaParserService
 */
export const assistantsCriteriaParserServiceMock = {
  getAssistant: jest.fn().mockImplementation(() => {
    const assistantId: string = uuid();
    return assistantId;
  }),
};

/* eslint-disable @typescript-eslint/no-unused-vars */
import { GenerateFirstQuestionDto } from 'src/modules/haven-ai-agent/dto/generate-first-question.dto';
import { UserMessage } from 'src/shared/interfaces/interfaces';

/**
 * Mocks the PromptCreatorService
 */
export const promptCreatorServiceMock = {
  createFirstPrompt: jest
    .fn()
    .mockImplementation(
      (generateFirstQuestionDto: GenerateFirstQuestionDto) => {
        const userMessage: UserMessage = {
          content: 'Hello, I am a refugee from Syria. I am looking for a job.',
          role: 'user',
        };

        return userMessage;
      },
    ),
  createFollowUpPrompt: jest
    .fn()
    .mockImplementation((refugeeResponse: string) => {
      const userMessage: UserMessage = {
        content: refugeeResponse,
        role: 'user',
      };

      return userMessage;
    }),
};

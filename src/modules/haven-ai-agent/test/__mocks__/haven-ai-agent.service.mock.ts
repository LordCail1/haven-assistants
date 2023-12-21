/* eslint-disable @typescript-eslint/no-unused-vars */
import { GenerateFirstQuestionDto } from '../../dto/generate-first-question.dto';
import { ResponseObject } from '../../dto/response-object.dto';
import { v4 as uuid } from 'uuid';

export const havenAiAgentServiceMock = {
  generateFirstQuestion: jest
    .fn()
    .mockImplementation(
      (generateFirstQuestionDto: GenerateFirstQuestionDto) => {
        const responseObject: ResponseObject = {
          response: 'This is a response',
          isStoryGoodEnough: false,
          threadId: uuid(),
        };

        return Promise.resolve(responseObject);
      },
    ),
  generateFollowUpQuestion: jest.fn(),
};

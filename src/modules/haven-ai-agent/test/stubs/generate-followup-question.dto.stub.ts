import { GenerateFollowUpQuestionDto } from '../../dto/generate-followUp-question.dto';
import { v4 as uuid } from 'uuid';

/**
 * This stub is responsible for generating a GenerateFollowUpQuestionDto.
 * @returns A GenerateFollowUpQuestionDto stub.
 */
export const generateFollowupQuestionDtoStub =
  (): GenerateFollowUpQuestionDto => {
    return {
      refugeeResponse: 'This is my response...',
      threadId: uuid(),
    };
  };

import { IsNotEmpty, IsString } from 'class-validator';

/**
 * the data transfer object that is used when generating a follow up question.
 */
export class GenerateFollowUpQuestionDto {
  /**
   * The response that the refugee gave to the question.
   */
  @IsString()
  @IsNotEmpty()
  refugeeResponse: string;

  /**
   * The thread id that is used to identify the conversation between the refugee and the 'questioner'.
   */
  @IsNotEmpty()
  @IsString()
  threadId: string;
}

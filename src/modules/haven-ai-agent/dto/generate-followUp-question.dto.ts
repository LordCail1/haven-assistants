import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

/**
 * the data transfer object that is used when generating a follow up question.
 */
export class GenerateFollowUpQuestionDto {
  /**
   * The response that the refugee gave to the question.
   */
  @IsNotEmpty()
  @IsString()
  @MaxLength(10000)
  @MinLength(1)
  refugeeResponse: string;

  /**
   * The thread id that is used to identify the conversation between the refugee and the 'questioner'.
   */
  @IsNotEmpty()
  @IsString()
  @MaxLength(5000)
  @MinLength(1)
  threadId: string;
}

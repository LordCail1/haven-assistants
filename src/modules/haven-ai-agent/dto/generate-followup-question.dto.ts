import { IsNotEmpty, IsString } from 'class-validator';

export class GenerateFollowUpQuestionDto {
  @IsString()
  @IsNotEmpty()
  refugeeResponse: string;

  @IsNotEmpty()
  @IsString()
  threadId: string;
}

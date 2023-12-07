import { IsNotEmpty, IsString } from 'class-validator';

export class GenerateFollowUpQuestionDto {
  @IsString()
  @IsNotEmpty()
  userResponse: string;
}

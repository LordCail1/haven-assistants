import { IsEmail, MaxLength, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  @MinLength(3)
  @MaxLength(200)
  email: string;
}

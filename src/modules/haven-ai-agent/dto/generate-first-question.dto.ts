import {
  ArrayMinSize,
  IsArray,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsString,
  Length,
  MaxLength,
  MinLength,
} from 'class-validator';

/**
 * The data transfer object that is used when generating the first question.
 */
export class GenerateFirstQuestionDto {
  /**
   * The name of the refugee
   */
  @IsNotEmpty()
  @IsString()
  @MaxLength(500)
  @MinLength(1)
  name: string;

  /**
   * The family name of the refugee
   */
  @IsNotEmpty()
  @IsString()
  @MaxLength(500)
  @MinLength(1)
  familyName: string;

  /**
   * The email of the refugee
   */
  @IsEmail()
  @IsNotEmpty()
  @MaxLength(500)
  email: string;

  /**
   * The gender of the refugee
   */
  @IsNotEmpty()
  @IsString()
  @MaxLength(500)
  @MinLength(1)
  gender: string;

  /**
   * The highest education level of the refugee.
   */
  @IsNotEmpty()
  @IsString()
  @MaxLength(500)
  @MinLength(1)
  highestEducation: string;

  /**
   * All the languages the refugee speaks
   */
  @ArrayMinSize(1)
  @IsArray()
  @IsNotEmpty()
  @IsString({ each: true })
  @Length(1, 200, { each: true })
  languages: string[];

  /**
   * the small story that the refugee told about himself/herself. Will be in his/her language.
   */
  @IsNotEmpty()
  @IsString()
  @MaxLength(5000)
  @MinLength(1)
  myStory: string;

  /**
   * What coutnry the refugee was born in.
   */
  @IsNotEmpty()
  @IsString()
  @MaxLength(500)
  @MinLength(1)
  countryOfBirth: string;

  /**
   * The family structure of the refugee (couple, family with children, single)
   */
  @IsNotEmpty()
  @IsString()
  @MaxLength(500)
  @MinLength(1)
  familyStructure: string;

  /**
   * The number of people in the group interested in resettlement
   */
  @IsNotEmpty()
  @IsNumber()
  howManyPeopleInYourGroup: number;

  /**
   *The province or teritory that the refugee is interested in resettling to
   */
  @IsNotEmpty()
  @IsString()
  @MaxLength(500)
  @MinLength(1)
  resettlementProvinceOrTerritory: string;

  /**
   * The stage of resettlement that the refugee is in.
   */
  @IsNotEmpty()
  @IsString()
  @MaxLength(500)
  @MinLength(1)
  stageOfResettlement: string;

  /**
   * The city that the refugee is interested in resettling to.
   */
  @IsNotEmpty()
  @IsString()
  @MaxLength(500)
  @MinLength(1)
  resettlementCity: string;

  /**
   * The current city where the refugee is living.
   */
  @IsNotEmpty()
  @IsString()
  @MaxLength(500)
  @MinLength(1)
  currentCity: string;

  /**
   * The current country where the refugee is living.
   */
  @IsNotEmpty()
  @IsString()
  @MaxLength(500)
  @MinLength(1)
  currentCountry: string;

  /**
   * The current province or territory where the refugee is living.
   */
  @IsNotEmpty()
  @IsString()
  @MaxLength(500)
  @MinLength(1)
  currentProvinceOrTerritory: string;
}

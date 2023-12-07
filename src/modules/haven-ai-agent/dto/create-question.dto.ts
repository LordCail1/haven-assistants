import { IsEmail, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateQuestionDto {
  /**
   * The name of the user
   */
  @IsNotEmpty()
  @IsString()
  name: string;

  /**
   * The family name of the user
   */
  @IsNotEmpty()
  @IsString()
  familyName: string;

  /**
   * The email of the refugee
   */
  @IsEmail()
  @IsNotEmpty()
  email: string;

  /**
   * The gender of the refugee
   */
  @IsNotEmpty()
  @IsString()
  gender: string;

  /**
   * The highest education level of the refugee.
   */
  @IsNotEmpty()
  @IsString()
  highestEducation: string;

  /**
   * All the languages the refugee speaks
   */
  @IsNotEmpty()
  @IsString({ each: true })
  languages: string[];

  /**
   * the small story that the refugee told about himself/herself
   */
  @IsNotEmpty()
  @IsString()
  myStory: string;

  /**
   * What
   */
  @IsNotEmpty()
  @IsString()
  CountryOfBirth: string;

  /**
   * The family structure of the refugee (couple, family with children, single)
   */
  @IsNotEmpty()
  @IsString()
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
  resettlementProvinceOrTerritory: string;

  /**
   * The stage of resettlement that the refugee is in.
   */
  @IsNotEmpty()
  @IsString()
  stageOfResettlement: string;

  /**
   * The city that the refugee is interested in resettling to.
   */
  @IsNotEmpty()
  @IsString()
  resettlementCity: string;

  /**
   * The current city where the refugee is living.
   */
  @IsNotEmpty()
  @IsString()
  currentCity: string;

  /**
   * The current country where the refugee is living.
   */
  @IsNotEmpty()
  @IsString()
  currentCountry: string;

  /**
   * The current province or territory where the refugee is living.
   */
  @IsNotEmpty()
  @IsString()
  currentProvinceOrTerritory: string;
}

import { GenerateFirstQuestionDto } from '../../dto/generate-first-question.dto';

/**
 * This stub is responsible for generating a GenerateFirstQuestionDto.
 * @returns A GenerateFirstQuestionDto stub.
 */
export const generateFirstQuestionDtoStub = (): GenerateFirstQuestionDto => {
  return {
    name: 'John',
    familyName: 'Doe',
    email: 'johndoe@example.com',
    gender: 'Male',
    highestEducation: 'Bachelor',
    languages: ['English', 'Spanish'],
    myStory: 'This is my story...',
    countryOfBirth: 'USA',
    familyStructure: 'Single',
    howManyPeopleInYourGroup: 1,
    resettlementProvinceOrTerritory: 'Ontario',
    stageOfResettlement: 'Initial',
    resettlementCity: 'Toronto',
    currentCity: 'New York',
    currentCountry: 'USA',
    currentProvinceOrTerritory: 'New York',
  };
};

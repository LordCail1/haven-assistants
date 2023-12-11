import { GenerateFirstQuestionDto } from 'src/modules/haven-ai-agent/dto/generate-first-question.dto';

export const generateFirstQuestionDtoAhmed: GenerateFirstQuestionDto = {
  name: 'Ahmed',
  familyName: 'Al-Mustafa',
  email: 'ahmed.mustafa@example.com',
  gender: 'Male',
  highestEducation: "Bachelor's Degree",
  languages: ['Arabic', 'English'],
  myStory:
    'I am originally from Syria and have been living in a refugee camp in Turkey for the past three years. I hope to start a new life in Canada.',
  CountryOfBirth: 'Syria',
  familyStructure: 'Family with children',
  howManyPeopleInYourGroup: 4,
  resettlementProvinceOrTerritory: 'Ontario',
  stageOfResettlement: 'Application Submitted',
  resettlementCity: 'Toronto',
  currentCity: 'Istanbul',
  currentCountry: 'Turkey',
  currentProvinceOrTerritory: 'Istanbul',
};

export const generateFirstQuestionDtoJane: GenerateFirstQuestionDto = {
  name: 'Jane',
  familyName: 'Smith',
  email: 'jane.smith@example.com',
  gender: 'Female',
  highestEducation: 'Master',
  languages: ['English', 'Arabic'],
  myStory:
    'I am seeking asylum from persecution and looking for opportunities to work in my field of study.',
  CountryOfBirth: 'Iran',
  familyStructure: 'Single',
  howManyPeopleInYourGroup: 1,
  resettlementProvinceOrTerritory: 'British Columbia',
  stageOfResettlement: 'Intermediate',
  resettlementCity: 'Vancouver',
  currentCity: 'Tehran',
  currentCountry: 'Iran',
  currentProvinceOrTerritory: 'Tehran',
};

export const generateFirstQuestionDtoCarlos: GenerateFirstQuestionDto = {
  name: 'Carlos',
  familyName: 'Gonzalez',
  email: 'carlos.gonzalez@example.com',
  gender: 'Male',
  highestEducation: 'High School',
  languages: ['Spanish', 'English'],
  myStory:
    'I am from Venezuela and due to the political and economic crisis, I am seeking a better life in Canada.',
  CountryOfBirth: 'Venezuela',
  familyStructure: 'Single',
  howManyPeopleInYourGroup: 1,
  resettlementProvinceOrTerritory: 'Quebec',
  stageOfResettlement: 'Initial',
  resettlementCity: 'Montreal',
  currentCity: 'Caracas',
  currentCountry: 'Venezuela',
  currentProvinceOrTerritory: 'Capital District',
};

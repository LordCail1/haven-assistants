import { GenerateFirstQuestionDto } from 'src/modules/haven-ai-agent/dto/generate-first-question.dto';

export const mariam_basic: GenerateFirstQuestionDto = {
  name: 'Mariam',
  familyName: 'Oumarou',
  email: 'mariam.oumarou@example.com',
  gender: 'Female',
  highestEducation: "Master's Degree",
  languages: ['French', 'English'],
  myStory:
    'Je cherche une vie paisible au Canada à cause des troubles dans mon pays.',
  countryOfBirth: 'Niger',
  familyStructure: 'Single',
  howManyPeopleInYourGroup: 1,
  resettlementProvinceOrTerritory: 'Quebec',
  stageOfResettlement: 'I have refugee status and I am currently in Canada',
  resettlementCity: 'Montreal',
  currentCity: 'Niamey',
  currentCountry: 'Niger',
  currentProvinceOrTerritory: 'Niamey',
};

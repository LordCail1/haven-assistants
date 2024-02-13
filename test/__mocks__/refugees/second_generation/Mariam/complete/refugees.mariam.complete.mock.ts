import { GenerateFirstQuestionDto } from 'src/modules/haven-ai-agent/dto/generate-first-question.dto';

export const mariam_complete: GenerateFirstQuestionDto = {
  name: 'Mariam',
  familyName: 'Oumarou',
  email: 'mariam.oumarou@example.com',
  gender: 'Female',
  highestEducation: "Master's Degree",
  languages: ['French', 'English'],
  myStory:
    "Originaire du Niger, ma vie a été un parcours de résilience au milieu des troubles politiques et des défis sociaux. En tant que femme seule, j'ai fait face à de nombreux obstacles, mais ma détermination pour une vie meilleure n'a jamais faibli. Ma motivation pour déménager au Canada découle de mon désir de sécurité, de stabilité, et de possibilités d'utiliser mon éducation et mes compétences. Mon histoire est celle de surmonter l'adversité, cherchant à avoir un impact positif dans ma nouvelle communauté au Québec.",
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

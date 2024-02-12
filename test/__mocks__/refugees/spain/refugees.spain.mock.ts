import { GenerateFirstQuestionDto } from 'src/modules/haven-ai-agent/dto/generate-first-question.dto';

export const spain_Carlos: GenerateFirstQuestionDto = {
  name: 'Carlos',
  familyName: 'García',
  email: 'carlos.garcia@example.com',
  gender: 'Male',
  highestEducation: "Bachelor's Degree",
  languages: ['Spanish', 'English'],
  myStory: `Mi nombre es Carlos García, soy de Bogotá, Colombia. Trabajaba en el campo de la salud cuando tuve la oportunidad de salvar la vida de alguien en un accidente. Fue un momento impactante. Ahora, mi familia y yo buscamos una nueva vida en Canadá debido a desafíos económicos y sociales en Colombia. Esperamos encontrar oportunidades en Vancouver.`,
  countryOfBirth: 'Colombia',
  familyStructure: 'Family with children',
  howManyPeopleInYourGroup: 4,
  resettlementProvinceOrTerritory: 'British Columbia',
  stageOfResettlement:
    'I have applied to come to Canada for humanitarian reasons',
  resettlementCity: 'Vancouver',
  currentCity: 'Bogotá',
  currentCountry: 'Colombia',
  currentProvinceOrTerritory: 'Bogotá',
};

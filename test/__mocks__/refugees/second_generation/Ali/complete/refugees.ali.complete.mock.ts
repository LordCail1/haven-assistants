import { GenerateFirstQuestionDto } from 'src/modules/haven-ai-agent/dto/generate-first-question.dto';

export const ali_complete: GenerateFirstQuestionDto = {
  name: 'Ali',
  familyName: 'Hassan',
  email: 'ali.hassan@example.com',
  gender: 'Male',
  highestEducation: 'No Formal Education',
  languages: ['Arabic'],
  myStory:
    'من حلب، سوريا، حياة عائلتي مليئة بالصراعات، مما يهدد سلامتنا ويحرمنا من أي مظهر من مظاهر الحياة الطبيعية. بدون تعليم رسمي، تقلصت فرصي بشكل كبير، لكن عزمي على توفير مستقبل أفضل لأطفالي ظل ثابتاً. رحلتنا إلى كندا كطالبي لجوء مدفوعة بالأمل في الأمان، مجتمع مستقر، وفرصة لأطفالي لمتابعة التعليم والأحلام دون قيود الحرب. قصتنا واحدة من الشجاعة، واجهنا صعوبات جمة بالأمل في المساهمة في مجتمعنا الجديد في مانيتوبا بالمرونة والامتنان.',
  countryOfBirth: 'Syria',
  familyStructure: 'Family with children',
  howManyPeopleInYourGroup: 4,
  resettlementProvinceOrTerritory: 'Manitoba',
  stageOfResettlement: 'I am an asylum seeker, and I am currently in Canada',
  resettlementCity: 'Winnipeg',
  currentCity: 'Aleppo',
  currentCountry: 'Syria',
  currentProvinceOrTerritory: 'Aleppo',
};

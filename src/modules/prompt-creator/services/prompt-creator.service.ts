import { GenerateFirstQuestionDto } from 'src/modules/haven-ai-agent/dto/generate-first-question.dto';
import { Injectable } from '@nestjs/common';
import { UserMessage } from 'src/shared/interfaces/interfaces';

@Injectable()
export class PromptCreatorService {
  createFirstPrompt(
    generateFirstQuestionDto: GenerateFirstQuestionDto,
  ): UserMessage {
    const {
      CountryOfBirth,
      currentCity,
      currentCountry,
      currentProvinceOrTerritory,
      email,
      familyName,
      familyStructure,
      gender,
      highestEducation,
      howManyPeopleInYourGroup,
      languages,
      myStory,
      name,
      resettlementCity,
      resettlementProvinceOrTerritory,
      stageOfResettlement,
    } = generateFirstQuestionDto;

    const languagesInTextFormat = this.loopLanguagesArray(languages);

    return {
      role: 'user',
      content: `
Hello AI Assistant,

My name is ${name} ${familyName}. I'd like to share some information about myself to help you understand my situation better:

1. **Name:** My first name is ${name}.
2. **Family Name:** My family or last name is ${familyName}.
3. **Email:** You can reach me at ${email}.
4. **Gender:** I identify as ${gender}.
5. **Highest Education:** The highest education I have attained is ${highestEducation}.
6. **Languages:** I speak ${languagesInTextFormat}.
7. **My Story:** ${myStory}.
8. **Country of Birth:** my country of birth is ${CountryOfBirth}.
9. **Family Structure:** my family structure is: ${familyStructure}.
10. **Group Size:** my group size is: ${howManyPeopleInYourGroup}
11. **Resettlement Province/Territory:** this is where I am interested in resettling: ${resettlementProvinceOrTerritory}.
12. **Stage of Resettlement:** My stage of resettlement is the following: ${stageOfResettlement}.
13. **Resettlement City:** the city in which I wish to resettle is: ${resettlementCity}.
14. **Current City:** Currently, the city in which I am residing is: ${currentCity}.
15. **Current Country:** My current country at the moment is: ${currentCountry}.
16. **Current Province/Territory:** the current province/territory I am currently in is: ${currentProvinceOrTerritory}.

I hope this information helps you create questions that are relevant to my journey and aspirations.

Please jump right in to asking me a question and do not present yourself, say hi to me or anything like this. 

Just start asking a question. I will send you my responses.

Ahmed Al-Mustafa
      `,
    };
  }

  createFollowUpPrompt(refugeeResponse: string): UserMessage {
    return {
      role: 'user',
      content: refugeeResponse,
    };
  }

  private loopLanguagesArray(languages: string[]): string {
    let languagesInTextFormat = '';

    languages.forEach((language, index) => {
      if (index === 0) {
        languagesInTextFormat += language;
      } else if (index === languages.length - 1) {
        languagesInTextFormat += `, ${language}`;
      } else {
        languagesInTextFormat += `, ${language}`;
      }
    });

    return languagesInTextFormat;
  }
}

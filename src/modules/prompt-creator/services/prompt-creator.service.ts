import { GenerateFirstQuestionDto } from 'src/modules/haven-ai-agent/dto/generate-first-question.dto';
import { Injectable } from '@nestjs/common';
import { UserMessage } from 'src/shared/interfaces/interfaces';

/**
 * This service is responsible for creating prompts for the AI assistant
 */
@Injectable()
export class PromptCreatorService {
  /**
   * This method is responsible for creating the first prompt that will be sent to the AI assistant.
   * @param generateFirstQuestionDto The DTO that contains the information that the refugee provided.
   * @returns The first prompt in the correct format
   */
  createFirstPrompt(
    generateFirstQuestionDto: GenerateFirstQuestionDto,
  ): UserMessage {
    const {
      countryOfBirth: CountryOfBirth,
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
Please note that, even though this message is written in english, this message is actually a template that
'Haven' wrote to inject the information I provided into the template! This means that I might not actually speak
english. The language that I actually speak will be the language that is used in the 'My Story' section.
Please analyze what language is written in 'My Story', and answer me in that language so that I can understand when you
generate the questions for me.
      `,
    };
  }

  /**
   * This method is responsible for creating the prompt that will be sent to the AI assistant when the refugee responds to a question.
   * @param refugeeResponse The response that the refugee provided.
   * @returns The prompt in the correct format
   */
  createFollowUpPrompt(refugeeResponse: string): UserMessage {
    return {
      role: 'user',
      content: refugeeResponse,
    };
  }

  /**
   * This method is responsible for looping through the languages array and returning the languages in text format.
   * @param languages The languages that the refugee speaks
   * @returns The languages in text format
   */
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

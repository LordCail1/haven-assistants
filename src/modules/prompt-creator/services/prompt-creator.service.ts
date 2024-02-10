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
1. **Name:** ${name}.
2. **Family Name:** ${familyName}.
3. **Email:** ${email}.
4. **Gender:** ${gender}.
5. **Highest Education:** ${highestEducation}.
6. **Languages:** ${languagesInTextFormat}.
7. **My Story:** ${myStory}.
8. **Country of Birth:** ${CountryOfBirth}.
9. **Family Structure:** ${familyStructure}.
10. **Group Size:** ${howManyPeopleInYourGroup}
11. **Resettlement Province/Territory:** ${resettlementProvinceOrTerritory}.
12. **Stage of Resettlement:** ${stageOfResettlement}.
13. **Resettlement City:** ${resettlementCity}.
14. **Current City:** ${currentCity}.
15. **Current Country:** ${currentCountry}.
16. **Current Province/Territory:** ${currentProvinceOrTerritory}.
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

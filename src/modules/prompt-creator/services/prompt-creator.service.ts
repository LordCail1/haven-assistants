import { GenerateFirstQuestionDto } from 'src/modules/haven-ai-agent/dto/generate-first-question.dto';
import { Injectable } from '@nestjs/common';
import { UserMessage } from 'src/shared/interfaces/interfaces';

/**
 * This service is responsible for creating prompts for the AI assistant
 */
@Injectable()
export class PromptCreatorService {
  createPromptForCriteriaParser(
    generateFirstQuestionDto: GenerateFirstQuestionDto,
  ): UserMessage {
    const { myStory } = generateFirstQuestionDto;

    return {
      role: 'user',
      content: `
      Here is the story of the refugee you must analyze and figure out what criterias have not been talked about:
      ${myStory}
      `,
    };
  }

  /**
   * This method is responsible for creating the first prompt that will be sent to the AI assistant.
   * @param generateFirstQuestionDto The DTO that contains the information that the refugee provided.
   * @param criteriaParserResponse The response that the criteria parser provided.
   * @returns The first prompt in the correct format
   */
  createFirstPromptForQuestioner(
    generateFirstQuestionDto: GenerateFirstQuestionDto,
    criteriaParserResponse: string,
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
17.Things you need to ask about =>  ${criteriaParserResponse}
      `,
    };
  }

  /**
   * This method is responsible for creating the prompt that will be sent to the AI assistant when the refugee responds to a question.
   * @param summary The summary that comes from the 'summarizer' assistant.
   * @returns The prompt in the correct format
   */
  createPromptForLanguageSimplifier(summary: string): UserMessage {
    return {
      role: 'user',
      content: `
      Here is the summary that comes from the 'summarizer' assistant. This is the summary you must work with
      ${summary}
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

import { Injectable } from '@nestjs/common';
import { CreateFirstQuestionDto } from '../dto/create-first-question.dto';
import { OpenaiService } from 'src/modules/openai/services/openai.service';

@Injectable()
export class HavenAiAgentService {
  constructor(private readonly openaiService: OpenaiService) {}
  async createFirstQuestion(
    createFirstQuestionDto: CreateFirstQuestionDto,
  ): Promise<string> {
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
    } = createFirstQuestionDto;
    await this.openaiService.createThread();

    return 'success!';
  }
}

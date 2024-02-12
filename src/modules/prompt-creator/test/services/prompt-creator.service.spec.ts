import { GenerateFirstQuestionDto } from 'src/modules/haven-ai-agent/dto/generate-first-question.dto';
import { PromptCreatorService } from '../../services/prompt-creator.service';
import { Test, TestingModule } from '@nestjs/testing';
import { generateFirstQuestionDtoStub } from 'src/modules/haven-ai-agent/test/stubs/generate-first-question.dto.stub';

describe('PromptCreatorService', () => {
  let promptCreatorService: PromptCreatorService;
  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PromptCreatorService],
    }).compile();
    promptCreatorService =
      module.get<PromptCreatorService>(PromptCreatorService);
  });

  it('should be defined', () => {
    expect(promptCreatorService).toBeDefined();
  });

  describe('createFirstPromptForQuestioner', () => {
    let generateFirstQuestionDto: GenerateFirstQuestionDto;

    beforeEach(() => {
      generateFirstQuestionDto = generateFirstQuestionDtoStub();
    });

    it('should return the correct prompt', async () => {
      // Act
      const result = promptCreatorService.createFirstPromptForQuestioner(
        generateFirstQuestionDto,
        'hey',
      );

      // Assert
      expect(result.content).toContain(generateFirstQuestionDto.name);
      expect(result.content).toContain(generateFirstQuestionDto.familyName);
      expect(result.content).toContain(generateFirstQuestionDto.email);
      expect(result.content).toContain(generateFirstQuestionDto.gender);
      expect(result.content).toContain(
        generateFirstQuestionDto.highestEducation,
      );
      expect(result.content).toContain(generateFirstQuestionDto.languages[0]);
      expect(result.content).toContain(generateFirstQuestionDto.languages[1]);
      expect(result.content).toContain(generateFirstQuestionDto.myStory);
      expect(result.content).toContain(generateFirstQuestionDto.countryOfBirth);
      expect(result.content).toContain(
        generateFirstQuestionDto.familyStructure,
      );
      expect(result.content).toContain(
        generateFirstQuestionDto.howManyPeopleInYourGroup.toString(),
      );
      expect(result.content).toContain(
        generateFirstQuestionDto.resettlementProvinceOrTerritory,
      );
      expect(result.content).toContain(
        generateFirstQuestionDto.stageOfResettlement,
      );
      expect(result.content).toContain(
        generateFirstQuestionDto.resettlementCity,
      );
      expect(result.content).toContain(generateFirstQuestionDto.currentCity);
      expect(result.content).toContain(generateFirstQuestionDto.currentCountry);
      expect(result.content).toContain(
        generateFirstQuestionDto.currentProvinceOrTerritory,
      );
    });
  });

  describe('createFollowUpPrompt', () => {
    let refugeeResponse: string;

    beforeEach(() => {
      refugeeResponse = 'This is my response';
    });

    it('should return the correct prompt', async () => {
      const result = promptCreatorService.createFollowUpPrompt(refugeeResponse);
      expect(result.content).toContain(refugeeResponse);
      expect(result.role).toBe('user');
    });
  });
});

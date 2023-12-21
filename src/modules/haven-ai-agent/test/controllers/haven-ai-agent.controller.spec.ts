import { Test, TestingModule } from '@nestjs/testing';
import { HavenAiAgentController } from '../../controllers/haven-ai-agent.controller';
import { HavenAiAgentService } from '../../services/haven-ai-agent.service';
import { havenAiAgentServiceMock } from '../__mocks__/haven-ai-agent.service.mock';
import { GenerateFirstQuestionDto } from '../../dto/generate-first-question.dto';
import { generateFirstQuestionDtoStub } from '../stubs/generate-first-question.dto.stub';
import { ResponseObject } from '../../interfaces/interfaces';
import { GenerateFollowUpQuestionDto } from '../../dto/generate-followUp-question.dto';
import { generateFollowupQuestionDtoStub } from '../stubs/generate-followup-question.dto.stub';
import { v4 as uuid } from 'uuid';

describe('HavenAiAgentController', () => {
  let havenAiAgentController: HavenAiAgentController;
  let havenAiAgentService: HavenAiAgentService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HavenAiAgentController,
        { provide: HavenAiAgentService, useValue: havenAiAgentServiceMock },
      ],
    }).compile();
    havenAiAgentController = module.get<HavenAiAgentController>(
      HavenAiAgentController,
    );
    havenAiAgentService = module.get<HavenAiAgentService>(HavenAiAgentService);
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  it('should be defined', () => {
    expect(havenAiAgentController).toBeDefined();
    expect(havenAiAgentService).toBeDefined();
  });

  describe('generateFirstQuestion', () => {
    let generateFirstQuestionDto: GenerateFirstQuestionDto;

    beforeEach(() => {
      generateFirstQuestionDto = generateFirstQuestionDtoStub();
    });

    it('should call the correct services', async () => {
      await havenAiAgentController.generateFirstQuestion(
        generateFirstQuestionDto,
      );

      expect(havenAiAgentService.generateFirstQuestion).toHaveBeenCalledTimes(
        1,
      );

      expect(havenAiAgentService.generateFirstQuestion).toHaveBeenCalledWith(
        generateFirstQuestionDto,
      );
    });

    it('should return the correct response object', async () => {
      const response: ResponseObject =
        await havenAiAgentController.generateFirstQuestion(
          generateFirstQuestionDto,
        );
      expect(response.isStoryGoodEnough).toBe(false);
      expect(response.response).toBeDefined();
      expect(response.threadId).toBeDefined();
      expect(response.summarizedStory).toBeUndefined();
    });
  });

  describe('generateFollowUpQuestion', () => {
    let generateFollowUpQuestionDto: GenerateFollowUpQuestionDto;

    beforeEach(() => {
      generateFollowUpQuestionDto = generateFollowupQuestionDtoStub();
    });

    it('should call the correct services', async () => {
      await havenAiAgentController.generateFollowUpQuestion(
        generateFollowUpQuestionDto,
      );

      expect(
        havenAiAgentService.generateFollowUpQuestion,
      ).toHaveBeenCalledTimes(1);

      expect(havenAiAgentService.generateFollowUpQuestion).toHaveBeenCalledWith(
        generateFollowUpQuestionDto,
      );
    });

    describe('if the conversation is not over', () => {
      it('should return the correct response object', async () => {
        jest
          .spyOn(havenAiAgentService, 'generateFollowUpQuestion')
          .mockImplementationOnce(() => {
            const responseObject: ResponseObject = {
              response: 'story is not good enough',
              isStoryGoodEnough: false,
              threadId: uuid(),
            };
            return Promise.resolve(responseObject);
          });

        const response: ResponseObject =
          await havenAiAgentController.generateFollowUpQuestion(
            generateFollowUpQuestionDto,
          );
        expect(response.isStoryGoodEnough).toBe(false);
        expect(response.response).toBeDefined();
        expect(response.threadId).toBeDefined();
        expect(response.summarizedStory).toBeUndefined();
      });
    });

    describe('if the conversation is over', () => {
      it('should return the correct response object', async () => {
        jest
          .spyOn(havenAiAgentService, 'generateFollowUpQuestion')
          .mockImplementationOnce(() => {
            const responseObject: ResponseObject = {
              isStoryGoodEnough: true,
              threadId: uuid(),
              summarizedStory: 'summarized story',
            };
            return Promise.resolve(responseObject);
          });

        const response: ResponseObject =
          await havenAiAgentController.generateFollowUpQuestion(
            generateFollowUpQuestionDto,
          );
        expect(response.isStoryGoodEnough).toBe(true);
        expect(response.summarizedStory).toBeDefined();
        expect(response.threadId).toBeDefined();
        expect(response.response).toBeUndefined();
      });
    });
  });
});

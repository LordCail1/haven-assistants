import { Test, TestingModule } from '@nestjs/testing';
import { HavenAiAgentService } from '../services/haven-ai-agent.service';
import { PromptCreatorService } from 'src/modules/prompt-creator/services/prompt-creator.service';
import { promptCreatorServiceMock } from 'src/modules/prompt-creator/test/__mocks__/prompt-creator.service.mock';
import { OpenaiThreadsService } from 'src/modules/openai/services/threads/openai.threads.service';
import { openaiThreadsServiceMock } from 'src/modules/openai/test/__mocks__/threads/openai.threads.service.mock';
import { OpenaiMessagesService } from 'src/modules/openai/services/messages/openai.messages.service';
import { openaiMessagesServiceMock } from 'src/modules/openai/test/__mocks__/messages/openai.messages.service.mock';
import { OpenaiRunsService } from 'src/modules/openai/services/runs/openai.runs.service';
import { openaiRunsServiceMock } from 'src/modules/openai/test/__mocks__/runs/openai.runs.service.mock';
import { AssistantsQuestionerService } from 'src/modules/assistants/services/questioner/assistants.questioner.service';
import { assistantsQuestionerServiceMock } from 'src/modules/assistants/test/__mocks__/questioner/assistants.questioner.service.mock';
import { AssistantsTerminatorService } from 'src/modules/assistants/services/terminator/assistants.terminator.service';
import { assistantsTerminatorServiceMock } from 'src/modules/assistants/test/__mocks__/terminator/assistants.terminator.service.mock';
import { AssistantsSummarizerService } from 'src/modules/assistants/services/summarizer/assistants.summarizer.service';
import { assistantsSummarizerServiceMock } from 'src/modules/assistants/test/__mocks__/summarizer/assistants.summarizer.service.mock';
import { GenerateFirstQuestionDto } from '../dto/generate-first-question.dto';

describe('HavenAiAgentService', () => {
  let havenAiAgentService: HavenAiAgentService;
  let promptCreatorService: PromptCreatorService;
  let openaiThreadsService: OpenaiThreadsService;
  let openaiMessagesService: OpenaiMessagesService;
  let openaiRunsService: OpenaiRunsService;
  let assistantsQuestionerService: AssistantsQuestionerService;
  let assistantsTerminatorService: AssistantsTerminatorService;
  let assistantsSummarizerService: AssistantsSummarizerService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HavenAiAgentService,
        { provide: PromptCreatorService, useValue: promptCreatorServiceMock },
        { provide: OpenaiThreadsService, useValue: openaiThreadsServiceMock },
        { provide: OpenaiMessagesService, useValue: openaiMessagesServiceMock },
        { provide: OpenaiRunsService, useValue: openaiRunsServiceMock },
        {
          provide: AssistantsQuestionerService,
          useValue: assistantsQuestionerServiceMock,
        },
        {
          provide: AssistantsTerminatorService,
          useValue: assistantsTerminatorServiceMock,
        },
        {
          provide: AssistantsSummarizerService,
          useValue: assistantsSummarizerServiceMock,
        },
      ],
    }).compile();
    havenAiAgentService = module.get<HavenAiAgentService>(HavenAiAgentService);
    promptCreatorService =
      module.get<PromptCreatorService>(PromptCreatorService);
    openaiThreadsService =
      module.get<OpenaiThreadsService>(OpenaiThreadsService);
    openaiMessagesService = module.get<OpenaiMessagesService>(
      OpenaiMessagesService,
    );
    openaiRunsService = module.get<OpenaiRunsService>(OpenaiRunsService);
    assistantsQuestionerService = module.get<AssistantsQuestionerService>(
      AssistantsQuestionerService,
    );
    assistantsTerminatorService = module.get<AssistantsTerminatorService>(
      AssistantsTerminatorService,
    );
    assistantsSummarizerService = module.get<AssistantsSummarizerService>(
      AssistantsSummarizerService,
    );
  });

  it('should be defined', () => {
    expect(havenAiAgentService).toBeDefined();
    expect(promptCreatorService).toBeDefined();
    expect(openaiThreadsService).toBeDefined();
    expect(openaiMessagesService).toBeDefined();
    expect(openaiRunsService).toBeDefined();
    expect(assistantsQuestionerService).toBeDefined();
    expect(assistantsTerminatorService).toBeDefined();
    expect(assistantsSummarizerService).toBeDefined();
  });

  describe('generateFirstQuestion', () => {
    let generateFirstQuestionDto: GenerateFirstQuestionDto;

    beforeEach(async () => {
      generateFirstQuestionDto = {
        name: 'John Doe',
        familyName: 'Doe',
        email: 'johndoe@example.com',
        gender: 'Male',
        highestEducation: 'Bachelor',
        languages: ['English', 'Spanish'],
        myStory: 'This is my story...',
        CountryOfBirth: 'USA',
        familyStructure: 'Single',
        howManyPeopleInYourGroup: 1,
        resettlementProvinceOrTerritory: 'Ontario',
        stageOfResettlement: 'Initial',
        resettlementCity: 'Toronto',
        currentCity: 'New York',
        currentCountry: 'USA',
        currentProvinceOrTerritory: 'New York',
      };

      await havenAiAgentService.generateFirstQuestion(generateFirstQuestionDto);
    });

    it('all services should be called correctly', () => {});
  });
});

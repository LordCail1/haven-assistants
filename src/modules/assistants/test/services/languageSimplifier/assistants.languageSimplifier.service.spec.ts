import { Test, TestingModule } from '@nestjs/testing';
import OpenAI from 'openai';
import { Assistant } from 'openai/resources/beta/assistants';
import { GettingAssistantException } from 'src/modules/assistants/exceptions/geting-assistant.exception';
import { InitializingAssistantException } from 'src/modules/assistants/exceptions/initializing-assistant.exception';
import { AssistantsLanguageSimplifierService } from 'src/modules/assistants/services/languageSimplifier/assistants.languageSimplifier.service';
import { HelpersService } from 'src/modules/helpers/services/helpers.service';
import { helpersServiceMock } from 'src/modules/helpers/test/__mocks__/helpers.service.mock';
import { MyLogger } from 'src/modules/logger/services/logger.service';
import { MyLoggerMock } from 'src/modules/logger/test/__mocks__/logger.service.mock';
import { OpenaiAssistantsService } from 'src/modules/openai/services/assistants/openai.assistants.service';
import { OpenaiMessagesService } from 'src/modules/openai/services/messages/openai.messages.service';
import { OpenaiRunsService } from 'src/modules/openai/services/runs/openai.runs.service';
import { OpenaiThreadsService } from 'src/modules/openai/services/threads/openai.threads.service';
import { openaiAssistantsServiceMock } from 'src/modules/openai/test/__mocks__/assistants/openai.assistants.service.mock';
import { openaiMessagesServiceMock } from 'src/modules/openai/test/__mocks__/messages/openai.messages.service.mock';
import { openaiMock } from 'src/modules/openai/test/__mocks__/openai.mock';
import { openaiRunsServiceMock } from 'src/modules/openai/test/__mocks__/runs/openai.runs.service.mock';
import { openaiThreadsServiceMock } from 'src/modules/openai/test/__mocks__/threads/openai.threads.service.mock';
import { PromptCreatorService } from 'src/modules/prompt-creator/services/prompt-creator.service';
import { promptCreatorServiceMock } from 'src/modules/prompt-creator/test/__mocks__/prompt-creator.service.mock';

describe('AssistantsLanguageParserService', () => {
  let assistantsLanguageSimplifierService: AssistantsLanguageSimplifierService;
  let openai: OpenAI;
  let helpersService: HelpersService;
  let openaiAssistantsService: OpenaiAssistantsService;
  let openaiMessagesService: OpenaiMessagesService;
  let openaiRunsService: OpenaiRunsService;
  let openaiThreadsService: OpenaiThreadsService;
  let promptCreatorService: PromptCreatorService;
  let myLogger: MyLogger;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AssistantsLanguageSimplifierService,

        { provide: OpenAI, useValue: openaiMock },
        { provide: HelpersService, useValue: helpersServiceMock },
        {
          provide: OpenaiAssistantsService,
          useValue: openaiAssistantsServiceMock,
        },
        { provide: OpenaiMessagesService, useValue: openaiMessagesServiceMock },
        { provide: OpenaiRunsService, useValue: openaiRunsServiceMock },
        { provide: OpenaiThreadsService, useValue: openaiThreadsServiceMock },
        { provide: PromptCreatorService, useValue: promptCreatorServiceMock },
        { provide: MyLogger, useValue: MyLoggerMock },
      ],
    }).compile();

    assistantsLanguageSimplifierService =
      module.get<AssistantsLanguageSimplifierService>(
        AssistantsLanguageSimplifierService,
      );
    openai = module.get<OpenAI>(OpenAI);
    helpersService = module.get<HelpersService>(HelpersService);
    openaiAssistantsService = module.get<OpenaiAssistantsService>(
      OpenaiAssistantsService,
    );
    openaiMessagesService = module.get<OpenaiMessagesService>(
      OpenaiMessagesService,
    );
    openaiRunsService = module.get<OpenaiRunsService>(OpenaiRunsService);
    promptCreatorService =
      module.get<PromptCreatorService>(PromptCreatorService);
    openaiThreadsService =
      module.get<OpenaiThreadsService>(OpenaiThreadsService);
    myLogger = module.get<MyLogger>(MyLogger);
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  it('should be defined', () => {
    expect(assistantsLanguageSimplifierService).toBeDefined();
    expect(helpersService).toBeDefined();
    expect(myLogger).toBeDefined();
    expect(openai).toBeDefined();
    expect(openaiAssistantsService).toBeDefined();
    expect(openaiMessagesService).toBeDefined();
    expect(openaiRunsService).toBeDefined();
    expect(openaiThreadsService).toBeDefined();
    expect(promptCreatorService).toBeDefined();
  });

  describe('getAssistant', () => {
    let assistant: Assistant;

    it('should return the assistant', async () => {
      await assistantsLanguageSimplifierService.initializeAssistant();
      assistant = assistantsLanguageSimplifierService.getAssistant();
      expect(assistant).toBeDefined();
    });

    it('should throw an exception if the assistant is not defined', async () => {
      jest
        .spyOn(openaiAssistantsService, 'createAssistant')
        .mockResolvedValueOnce(undefined);
      await assistantsLanguageSimplifierService.initializeAssistant();
      try {
        assistant = assistantsLanguageSimplifierService.getAssistant();
      } catch (error) {
        expect(error).toBeInstanceOf(GettingAssistantException);
      }
    });
  });

  describe('initializeAssistant', () => {
    it('should call all of the correct services', async () => {
      await assistantsLanguageSimplifierService.initializeAssistant();

      expect(openaiAssistantsService.listAllAssistants).toHaveBeenCalledTimes(
        1,
      );
      expect(openaiAssistantsService.deleteAssistant).toHaveBeenCalledTimes(1);
      expect(openaiAssistantsService.createAssistant).toHaveBeenCalledTimes(1);
    });

    describe('should throw an exception', () => {
      it('if deleteAssistant throws an exception', async () => {
        jest
          .spyOn(openaiAssistantsService, 'deleteAssistant')
          .mockRejectedValueOnce(new Error());
        try {
          await assistantsLanguageSimplifierService.initializeAssistant();
        } catch (error) {
          expect(error).toBeInstanceOf(InitializingAssistantException);
        }
      });

      it('if createAssistant throws an exception', async () => {
        jest
          .spyOn(openaiAssistantsService, 'createAssistant')
          .mockRejectedValueOnce(new Error());

        try {
          await assistantsLanguageSimplifierService.initializeAssistant();
        } catch (error) {
          expect(error).toBeInstanceOf(InitializingAssistantException);
        }
      });
    });
  });

  describe('simplifyLanguage', () => {
    beforeEach(async () => {
      await assistantsLanguageSimplifierService.initializeAssistant();
    });

    it('should call the correct services', async () => {
      await assistantsLanguageSimplifierService.simplifyLanguage(
        'summarizedText',
      );
      expect(openaiThreadsService.createThread).toHaveBeenCalledTimes(1);
      expect(
        promptCreatorService.createPromptForLanguageSimplifier,
      ).toHaveBeenCalledTimes(1);
      expect(openaiMessagesService.createMessage).toHaveBeenCalledTimes(1);
      expect(openaiRunsService.createRun).toHaveBeenCalledTimes(1);
      expect(openaiRunsService.retrieveRun).toHaveBeenCalledTimes(1);
      expect(openaiMessagesService.listMessages).toHaveBeenCalledTimes(1);
    });
  });
});

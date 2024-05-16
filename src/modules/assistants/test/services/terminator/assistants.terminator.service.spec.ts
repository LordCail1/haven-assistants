import { AssistantsTerminatorService } from 'src/modules/assistants/services/terminator/assistants.terminator.service';
import { GettingAssistantException } from 'src/modules/assistants/exceptions/geting-assistant.exception';
import { HelpersService } from 'src/modules/helpers/services/helpers.service';
import { helpersServiceMock } from 'src/modules/helpers/test/__mocks__/helpers.service.mock';
import { InitializingAssistantException } from 'src/modules/assistants/exceptions/initializing-assistant.exception';
import { OpenaiAssistantsService } from 'src/modules/openai/services/assistants/openai.assistants.service';
import { openaiAssistantsServiceMock } from 'src/modules/openai/test/__mocks__/assistants/openai.assistants.service.mock';
import { OpenaiMessagesService } from 'src/modules/openai/services/messages/openai.messages.service';
import { openaiMessagesServiceMock } from 'src/modules/openai/test/__mocks__/messages/openai.messages.service.mock';
import { openaiMock } from 'src/modules/openai/test/__mocks__/openai.mock';
import { OpenaiRunsService } from 'src/modules/openai/services/runs/openai.runs.service';
import { openaiRunsServiceMock } from 'src/modules/openai/test/__mocks__/runs/openai.runs.service.mock';
import { OpenaiThreadsService } from 'src/modules/openai/services/threads/openai.threads.service';
import { openaiThreadsServiceMock } from 'src/modules/openai/test/__mocks__/threads/openai.threads.service.mock';
import { Test, TestingModule } from '@nestjs/testing';
import OpenAI from 'openai';
import { v4 as uuid } from 'uuid';
import { DetermineStoryGoodEnoughException } from 'src/modules/assistants/exceptions/terminator/determine-story-good-enough.exception';
import { MyLogger } from 'src/modules/logger/services/logger.service';
import { MyLoggerMock } from 'src/modules/logger/test/__mocks__/logger.service.mock';
import { Assistant } from 'openai/resources/beta/assistants';

describe('AssistantsAbstractService', () => {
  let assistantsTerminatorService: AssistantsTerminatorService;
  let openai: OpenAI;
  let helpersService: HelpersService;
  let openaiAssistantsService: OpenaiAssistantsService;
  let openaiMessagesService: OpenaiMessagesService;
  let openaiRunsService: OpenaiRunsService;
  let openaiThreadsService: OpenaiThreadsService;
  let myLogger: MyLogger;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AssistantsTerminatorService,
        { provide: OpenAI, useValue: openaiMock },
        { provide: HelpersService, useValue: helpersServiceMock },
        {
          provide: OpenaiAssistantsService,
          useValue: openaiAssistantsServiceMock,
        },
        { provide: OpenaiMessagesService, useValue: openaiMessagesServiceMock },
        { provide: OpenaiRunsService, useValue: openaiRunsServiceMock },
        { provide: OpenaiThreadsService, useValue: openaiThreadsServiceMock },
        { provide: MyLogger, useValue: MyLoggerMock },
      ],
    }).compile();

    assistantsTerminatorService = module.get<AssistantsTerminatorService>(
      AssistantsTerminatorService,
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
    openaiThreadsService =
      module.get<OpenaiThreadsService>(OpenaiThreadsService);
    myLogger = module.get<MyLogger>(MyLogger);
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  it('should be defined', () => {
    expect(assistantsTerminatorService).toBeDefined();
    expect(openai).toBeDefined();
    expect(helpersService).toBeDefined();
    expect(openaiAssistantsService).toBeDefined();
    expect(openaiMessagesService).toBeDefined();
    expect(openaiRunsService).toBeDefined();
    expect(openaiThreadsService).toBeDefined();
    expect(myLogger).toBeDefined();
  });

  describe('getAssistant', () => {
    let assistant: Assistant;

    it('should return the assistant', async () => {
      await assistantsTerminatorService.initializeAssistant();
      assistant = assistantsTerminatorService.getAssistant();
      expect(assistant).toBeDefined();
    });

    it('should throw an exception if the assistant is not defined', async () => {
      jest
        .spyOn(openaiAssistantsService, 'createAssistant')
        .mockResolvedValueOnce(undefined);
      await assistantsTerminatorService.initializeAssistant();
      try {
        assistant = assistantsTerminatorService.getAssistant();
      } catch (error) {
        expect(error).toBeInstanceOf(GettingAssistantException);
      }
    });
  });

  describe('initializeAssistant', () => {
    it('should call all of the correct services', async () => {
      await assistantsTerminatorService.initializeAssistant();

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
          await assistantsTerminatorService.initializeAssistant();
        } catch (error) {
          expect(error).toBeInstanceOf(InitializingAssistantException);
        }
      });

      it('if createAssistant throws an exception', async () => {
        jest
          .spyOn(openaiAssistantsService, 'createAssistant')
          .mockRejectedValueOnce(new Error());

        try {
          await assistantsTerminatorService.initializeAssistant();
        } catch (error) {
          expect(error).toBeInstanceOf(InitializingAssistantException);
        }
      });
    });
  });

  describe('determineIfStoryIsGoodEnough', () => {
    let isStoryGoodEnough: boolean;

    it('should call all of the correct services', async () => {
      await assistantsTerminatorService.determineIfStoryIsGoodEnough(uuid());
      expect(openaiMessagesService.listMessages).toHaveBeenCalledTimes(2);
      expect(
        helpersService.convertThreadMessagesToMessageArray,
      ).toHaveBeenCalledTimes(1);
      expect(openaiThreadsService.createThread).toHaveBeenCalledTimes(1);
      expect(openaiRunsService.createRun).toHaveBeenCalledTimes(1);
      expect(openaiRunsService.retrieveRun).toHaveBeenCalledTimes(1);
      expect(
        helpersService.parseTerminatorResponseForJson,
      ).toHaveBeenCalledTimes(1);
    });

    describe('should return', () => {
      it('true if the story is good enough', async () => {
        jest
          .spyOn(helpersService, 'parseTerminatorResponseForJson')
          .mockReturnValueOnce(true);
        isStoryGoodEnough =
          await assistantsTerminatorService.determineIfStoryIsGoodEnough(
            uuid(),
          );
        expect(isStoryGoodEnough).toEqual(true);
      });

      it('false if the story is not good enough', async () => {
        isStoryGoodEnough =
          await assistantsTerminatorService.determineIfStoryIsGoodEnough(
            uuid(),
          );
        expect(isStoryGoodEnough).toEqual(false);
      });
    });

    describe('should throw an exception', () => {
      it('if listMessages throws an exception', async () => {
        jest
          .spyOn(openaiMessagesService, 'listMessages')
          .mockRejectedValueOnce(new Error());
        try {
          await assistantsTerminatorService.determineIfStoryIsGoodEnough(
            uuid(),
          );
        } catch (error) {
          expect(error).toBeInstanceOf(DetermineStoryGoodEnoughException);
        }
      });

      it('if convertThreadMessagesToMessageArray throws an exception', async () => {
        jest
          .spyOn(helpersService, 'convertThreadMessagesToMessageArray')
          .mockImplementationOnce(() => {
            throw new Error();
          });
        try {
          await assistantsTerminatorService.determineIfStoryIsGoodEnough(
            uuid(),
          );
        } catch (error) {
          expect(error).toBeInstanceOf(DetermineStoryGoodEnoughException);
        }
      });

      it('if createThread throws an exception', async () => {
        jest
          .spyOn(openaiThreadsService, 'createThread')
          .mockRejectedValueOnce(new Error());
        try {
          await assistantsTerminatorService.determineIfStoryIsGoodEnough(
            uuid(),
          );
        } catch (error) {
          expect(error).toBeInstanceOf(DetermineStoryGoodEnoughException);
        }
      });

      it('if createRun throws an exception', async () => {
        jest
          .spyOn(openaiRunsService, 'createRun')
          .mockRejectedValueOnce(new Error());
        try {
          await assistantsTerminatorService.determineIfStoryIsGoodEnough(
            uuid(),
          );
        } catch (error) {
          expect(error).toBeInstanceOf(DetermineStoryGoodEnoughException);
        }
      });

      it('if retrieveRun throws an exception', async () => {
        jest
          .spyOn(openaiRunsService, 'retrieveRun')
          .mockRejectedValueOnce(new Error());
        try {
          await assistantsTerminatorService.determineIfStoryIsGoodEnough(
            uuid(),
          );
        } catch (error) {
          expect(error).toBeInstanceOf(DetermineStoryGoodEnoughException);
        }
      });

      it('if parseLastResponseForJson throws an exception', async () => {
        jest
          .spyOn(helpersService, 'parseTerminatorResponseForJson')
          .mockImplementationOnce(() => {
            throw new Error();
          });
        try {
          await assistantsTerminatorService.determineIfStoryIsGoodEnough(
            uuid(),
          );
        } catch (error) {
          expect(error).toBeInstanceOf(DetermineStoryGoodEnoughException);
        }
      });
    });
  });
});

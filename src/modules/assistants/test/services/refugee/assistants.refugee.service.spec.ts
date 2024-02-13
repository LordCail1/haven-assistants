import { Test, TestingModule } from '@nestjs/testing';
import OpenAI from 'openai';
import { Assistant } from 'openai/resources/beta/assistants/assistants';
import { GettingAssistantException } from 'src/modules/assistants/exceptions/geting-assistant.exception';
import { InitializingAssistantException } from 'src/modules/assistants/exceptions/initializing-assistant.exception';
import { AssistantsRefugeeService } from 'src/modules/assistants/services/refugee/assistants.refugee.service';
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

describe('AssistantsRefugeeService', () => {
  let assistantsRefugeeService: AssistantsRefugeeService;
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
        AssistantsRefugeeService,
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

    assistantsRefugeeService = module.get<AssistantsRefugeeService>(
      AssistantsRefugeeService,
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
    expect(assistantsRefugeeService).toBeDefined();
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
      await assistantsRefugeeService.initializeAssistant();
      assistant = assistantsRefugeeService.getAssistant();
      expect(assistant).toBeDefined();
    });

    it('should throw an exception if the assistant is not defined', async () => {
      jest
        .spyOn(openaiAssistantsService, 'createAssistant')
        .mockResolvedValueOnce(undefined);
      await assistantsRefugeeService.initializeAssistant();
      try {
        assistant = assistantsRefugeeService.getAssistant();
      } catch (error) {
        expect(error).toBeInstanceOf(GettingAssistantException);
      }
    });
  });

  describe('initializeAssistant', () => {
    it('should call all of the correct services', async () => {
      await assistantsRefugeeService.initializeAssistant();

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
          await assistantsRefugeeService.initializeAssistant();
        } catch (error) {
          expect(error).toBeInstanceOf(InitializingAssistantException);
        }
      });

      it('if createAssistant throws an exception', async () => {
        jest
          .spyOn(openaiAssistantsService, 'createAssistant')
          .mockRejectedValueOnce(new Error());

        try {
          await assistantsRefugeeService.initializeAssistant();
        } catch (error) {
          expect(error).toBeInstanceOf(InitializingAssistantException);
        }
      });
    });
  });
});

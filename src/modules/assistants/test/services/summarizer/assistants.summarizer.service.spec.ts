import { Assistant } from 'openai/resources/beta/assistants/assistants';
import { AssistantsSummarizerService } from 'src/modules/assistants/services/summarizer/assistants.summarizer.service';
import { CreateSummaryException } from 'src/modules/assistants/exceptions/summarizer/create-summary.exception';
import { GettingAssistantException } from 'src/modules/assistants/exceptions/geting-assistant.exception';
import { HelpersService } from 'src/modules/helpers/services/helpers.service';
import { helpersServiceMock } from 'src/modules/helpers/test/__mocks__/helpers.service.mock';
import { ImageNotTextException } from 'src/shared/exceptions/image-not-text.exception';
import { InitializingAssistantException } from 'src/modules/assistants/exceptions/initializing-assistant.exception';
import { messageContentImageFileStub } from 'src/modules/openai/test/stubs/openai.messageContentImageFile.stub';
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
import { threadMessageStub } from 'src/modules/openai/test/stubs/openai.threadMessage.stub';
import { v4 as uuid } from 'uuid';
import {
  MessageContentImageFile,
  ThreadMessage,
} from 'openai/resources/beta/threads/messages/messages';
import OpenAI from 'openai';

describe('AssistantsSummarizerService', () => {
  let assistantsSummarizerService: AssistantsSummarizerService;
  let openai: OpenAI;
  let helpersService: HelpersService;
  let openaiAssistantsService: OpenaiAssistantsService;
  let openaiMessagesService: OpenaiMessagesService;
  let openaiRunsService: OpenaiRunsService;
  let openaiThreadsService: OpenaiThreadsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AssistantsSummarizerService,
        { provide: OpenAI, useValue: openaiMock },
        { provide: HelpersService, useValue: helpersServiceMock },
        {
          provide: OpenaiAssistantsService,
          useValue: openaiAssistantsServiceMock,
        },
        { provide: OpenaiMessagesService, useValue: openaiMessagesServiceMock },
        { provide: OpenaiRunsService, useValue: openaiRunsServiceMock },
        { provide: OpenaiThreadsService, useValue: openaiThreadsServiceMock },
      ],
    }).compile();

    assistantsSummarizerService = module.get<AssistantsSummarizerService>(
      AssistantsSummarizerService,
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
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  it('should be defined', () => {
    expect(assistantsSummarizerService).toBeDefined();
    expect(openai).toBeDefined();
    expect(helpersService).toBeDefined();
    expect(openaiAssistantsService).toBeDefined();
    expect(openaiMessagesService).toBeDefined();
    expect(openaiRunsService).toBeDefined();
    expect(openaiThreadsService).toBeDefined();
  });

  describe('getAssistant', () => {
    let assistant: Assistant;

    it('should return the assistant', async () => {
      await assistantsSummarizerService.initializeAssistant();
      assistant = assistantsSummarizerService.getAssistant();
      expect(assistant).toBeDefined();
    });

    it('should throw an exception if the assistant is not defined', async () => {
      jest
        .spyOn(openaiAssistantsService, 'createAssistant')
        .mockResolvedValueOnce(undefined);
      await assistantsSummarizerService.initializeAssistant();
      try {
        assistant = assistantsSummarizerService.getAssistant();
      } catch (error) {
        expect(error).toBeInstanceOf(GettingAssistantException);
      }
    });
  });

  describe('initializeAssistant', () => {
    it('should call all of the correct services', async () => {
      await assistantsSummarizerService.initializeAssistant();

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
          await assistantsSummarizerService.initializeAssistant();
        } catch (error) {
          expect(error).toBeInstanceOf(InitializingAssistantException);
        }
      });

      it('if createAssistant throws an exception', async () => {
        jest
          .spyOn(openaiAssistantsService, 'createAssistant')
          .mockRejectedValueOnce(new Error());

        try {
          await assistantsSummarizerService.initializeAssistant();
        } catch (error) {
          expect(error).toBeInstanceOf(InitializingAssistantException);
        }
      });
    });
  });

  describe('createSummary', () => {
    let summary: string;

    beforeEach(async () => {
      await assistantsSummarizerService.initializeAssistant();
    });

    it('should call all of the correct services', async () => {
      await assistantsSummarizerService.createSummary(uuid());
      expect(openaiMessagesService.listMessages).toHaveBeenCalledTimes(2);
      expect(
        helpersService.convertThreadMessagesToMessageArray,
      ).toHaveBeenCalledTimes(1);
      expect(openaiThreadsService.createThread).toHaveBeenCalledTimes(1);
      expect(openaiRunsService.createRun).toHaveBeenCalledTimes(1);
      expect(openaiRunsService.retrieveRun).toHaveBeenCalledTimes(1);
    });

    it('should return a summary', async () => {
      summary = await assistantsSummarizerService.createSummary(uuid());
      expect(summary).toBeDefined();
    });

    describe('should throw an exception', () => {
      it('if listMessages throws an exception', async () => {
        jest
          .spyOn(openaiMessagesService, 'listMessages')
          .mockRejectedValueOnce(new Error());
        try {
          await assistantsSummarizerService.createSummary(uuid());
        } catch (error) {
          expect(error).toBeInstanceOf(CreateSummaryException);
        }
      });

      it('if convertThreadMessagesToMessageArray throws an exception', async () => {
        jest
          .spyOn(helpersService, 'convertThreadMessagesToMessageArray')
          .mockImplementationOnce(() => {
            throw new Error();
          });
        try {
          await assistantsSummarizerService.createSummary(uuid());
        } catch (error) {
          expect(error).toBeInstanceOf(CreateSummaryException);
        }
      });

      it('if createThread throws an exception', async () => {
        jest
          .spyOn(openaiThreadsService, 'createThread')
          .mockRejectedValueOnce(new Error());
        try {
          await assistantsSummarizerService.createSummary(uuid());
        } catch (error) {
          expect(error).toBeInstanceOf(CreateSummaryException);
        }
      });

      it('if createRun throws an exception', async () => {
        jest
          .spyOn(openaiRunsService, 'createRun')
          .mockRejectedValueOnce(new Error());
        try {
          await assistantsSummarizerService.createSummary(uuid());
        } catch (error) {
          expect(error).toBeInstanceOf(CreateSummaryException);
        }
      });

      it('if retrieveRun throws an exception', async () => {
        jest
          .spyOn(openaiRunsService, 'retrieveRun')
          .mockRejectedValueOnce(new Error());
        try {
          await assistantsSummarizerService.createSummary(uuid());
        } catch (error) {
          expect(error).toBeInstanceOf(CreateSummaryException);
        }
      });

      it('if the image is not text', async () => {
        jest
          .spyOn(openaiMessagesService, 'listMessages')
          .mockImplementationOnce((threadId: string) => {
            const firstMessageContentImageFile: MessageContentImageFile =
              messageContentImageFileStub();
            const firstThreadMessage: ThreadMessage = threadMessageStub(
              firstMessageContentImageFile,
            );
            firstThreadMessage.thread_id = threadId;

            const secondMessageContentImageFile: MessageContentImageFile =
              messageContentImageFileStub();
            const secondThreadMessage: ThreadMessage = threadMessageStub(
              secondMessageContentImageFile,
            );
            secondThreadMessage.thread_id = threadId;

            return Promise.resolve([firstThreadMessage, secondThreadMessage]);
          });
        try {
          await assistantsSummarizerService.createSummary(uuid());
        } catch (error) {
          expect(error).toBeInstanceOf(ImageNotTextException);
        }
      });
    });
  });
});

import { AssistantsQuestionerService } from 'src/modules/assistants/services/questioner/assistants.questioner.service';
import { assistantsQuestionerServiceMock } from 'src/modules/assistants/test/__mocks__/questioner/assistants.questioner.service.mock';
import { AssistantsSummarizerService } from 'src/modules/assistants/services/summarizer/assistants.summarizer.service';
import { assistantsSummarizerServiceMock } from 'src/modules/assistants/test/__mocks__/summarizer/assistants.summarizer.service.mock';
import { AssistantsTerminatorService } from 'src/modules/assistants/services/terminator/assistants.terminator.service';
import { assistantsTerminatorServiceMock } from 'src/modules/assistants/test/__mocks__/terminator/assistants.terminator.service.mock';
import { GenerateFirstQuestionDto } from '../../dto/generate-first-question.dto';
import { generateFirstQuestionDtoStub } from '../stubs/generate-first-question.dto.stub';
import { HavenAiAgentService } from '../../services/haven-ai-agent.service';
import { ImageNotTextException } from 'src/shared/exceptions/image-not-text.exception';
import { messageContentImageFileStub } from 'src/modules/openai/test/stubs/openai.messageContentImageFile.stub';
import { OpenaiMessagesService } from 'src/modules/openai/services/messages/openai.messages.service';
import { openaiMessagesServiceMock } from 'src/modules/openai/test/__mocks__/messages/openai.messages.service.mock';
import { OpenaiRunsService } from 'src/modules/openai/services/runs/openai.runs.service';
import { openaiRunsServiceMock } from 'src/modules/openai/test/__mocks__/runs/openai.runs.service.mock';
import { OpenaiThreadsService } from 'src/modules/openai/services/threads/openai.threads.service';
import { openaiThreadsServiceMock } from 'src/modules/openai/test/__mocks__/threads/openai.threads.service.mock';
import { PromptCreatorService } from 'src/modules/prompt-creator/services/prompt-creator.service';
import { promptCreatorServiceMock } from 'src/modules/prompt-creator/test/__mocks__/prompt-creator.service.mock';
import { ResponseObject } from '../../dto/response-object.dto';
import { Test, TestingModule } from '@nestjs/testing';
import { threadMessageStub } from 'src/modules/openai/test/stubs/openai.threadMessage.stub';
import {
  MessageContentImageFile,
  ThreadMessage,
} from 'openai/resources/beta/threads/messages/messages';
import { GenerateFollowUpQuestionDto } from '../../dto/generate-followUp-question.dto';
import { generateFollowupQuestionDtoStub } from '../stubs/generate-followup-question.dto.stub';
import { GenerateFollowUpQuestionException } from '../../exceptions/generate-follow-up-question.exception';

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

  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
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
      generateFirstQuestionDto = generateFirstQuestionDtoStub();
    });

    it('all services should be called correctly', async () => {
      const responseObject: ResponseObject =
        await havenAiAgentService.generateFirstQuestion(
          generateFirstQuestionDto,
        );

      expect(openaiThreadsService.createThread).toHaveBeenCalledTimes(1);
      expect(promptCreatorService.createFirstPrompt).toHaveBeenLastCalledWith(
        generateFirstQuestionDto,
      );
      expect(openaiMessagesService.createMessage).toHaveBeenCalledTimes(1);
      expect(openaiRunsService.createRun).toHaveBeenCalledTimes(1);
      expect(assistantsQuestionerService.getAssistant).toHaveBeenCalledTimes(1);
      expect(openaiRunsService.retrieveRun).toHaveBeenCalledTimes(1);
      expect(openaiMessagesService.listMessages).toHaveBeenCalledTimes(1);
      expect(responseObject.isStoryGoodEnough).toBe(false);
      expect(responseObject.response).toBeDefined();
      expect(responseObject.threadId).toBeDefined();
    });

    it('it should throw an error if the AI tries to send an image', async () => {
      jest
        .spyOn(openaiMessagesService, 'listMessages')
        .mockImplementationOnce((threadId: string) => {
          const messageContentImageFile: MessageContentImageFile =
            messageContentImageFileStub();

          const threadMessage: ThreadMessage = threadMessageStub(
            messageContentImageFile,
          );
          threadMessage.thread_id = threadId;

          return Promise.resolve([threadMessage]);
        });

      try {
        const responseObject: ResponseObject =
          await havenAiAgentService.generateFirstQuestion(
            generateFirstQuestionDto,
          );
        expect(responseObject).toBeUndefined();
        fail('should have thrown an error');
      } catch (error) {
        expect(error).toBeInstanceOf(ImageNotTextException);
      }
    });
  });

  describe('generateFollowUpQuestion', () => {
    let generateFollowUpQuestionDto: GenerateFollowUpQuestionDto;

    beforeEach(() => {
      generateFollowUpQuestionDto = generateFollowupQuestionDtoStub();
    });

    describe('if story is not good enough', () => {
      it('all services should be called correctly', async () => {
        await havenAiAgentService.generateFollowUpQuestion(
          generateFollowUpQuestionDto,
        );

        expect(
          promptCreatorService.createFollowUpPrompt,
        ).toHaveBeenLastCalledWith(generateFollowUpQuestionDto.refugeeResponse);
        expect(openaiMessagesService.createMessage).toHaveBeenCalledTimes(1);
        expect(
          assistantsTerminatorService.determineIfStoryIsGoodEnough,
        ).toHaveBeenCalledTimes(1);
        expect(
          assistantsSummarizerService.createSummary,
        ).not.toHaveBeenCalled();
        expect(openaiRunsService.createRun).toHaveBeenCalledTimes(1);
        expect(openaiRunsService.retrieveRun).toHaveBeenCalledTimes(1);
        expect(openaiMessagesService.listMessages).toHaveBeenCalledTimes(1);
      });

      it('should return the correct response object', async () => {
        const responseObject: ResponseObject =
          await havenAiAgentService.generateFollowUpQuestion(
            generateFollowUpQuestionDto,
          );
        expect(responseObject.isStoryGoodEnough).toBe(false);
        expect(responseObject.response).toBeDefined();
        expect(responseObject.threadId).toEqual(
          generateFollowUpQuestionDto.threadId,
        );
        expect(responseObject.summarizedStory).toBeUndefined();
      });

      it('it should throw an error if the AI tries to send an image', async () => {
        jest
          .spyOn(openaiMessagesService, 'listMessages')
          .mockImplementationOnce((threadId: string) => {
            const messageContentImageFile: MessageContentImageFile =
              messageContentImageFileStub();

            const threadMessage: ThreadMessage = threadMessageStub(
              messageContentImageFile,
            );
            threadMessage.thread_id = threadId;

            return Promise.resolve([threadMessage]);
          });

        try {
          const responseObject: ResponseObject =
            await havenAiAgentService.generateFollowUpQuestion(
              generateFollowUpQuestionDto,
            );
          expect(responseObject).toBeUndefined();
          fail('should have thrown an error');
        } catch (error) {
          expect(error).toBeInstanceOf(ImageNotTextException);
        }
      });
    });

    describe('if story is good enough', () => {
      beforeEach(() => {
        jest
          .spyOn(assistantsTerminatorService, 'determineIfStoryIsGoodEnough')
          .mockImplementationOnce(() => Promise.resolve(true));
      });

      it('all services should be called correctly', async () => {
        await havenAiAgentService.generateFollowUpQuestion(
          generateFollowUpQuestionDto,
        );
        expect(promptCreatorService.createFollowUpPrompt).toHaveBeenCalledTimes(
          1,
        );
        expect(promptCreatorService.createFollowUpPrompt).toHaveBeenCalledWith(
          generateFollowUpQuestionDto.refugeeResponse,
        );
        expect(openaiMessagesService.createMessage).toHaveBeenCalledTimes(1);
        expect(
          assistantsTerminatorService.determineIfStoryIsGoodEnough,
        ).toHaveBeenCalledTimes(1);
        expect(assistantsSummarizerService.createSummary).toHaveBeenCalledTimes(
          1,
        );
        expect(openaiThreadsService.deleteThread).toHaveBeenCalledTimes(1);
        expect(openaiRunsService.createRun).not.toHaveBeenCalled();
        expect(openaiRunsService.retrieveRun).not.toHaveBeenCalled();
        expect(openaiMessagesService.listMessages).not.toHaveBeenCalled();
      });

      it('should return the correct response object', async () => {
        const responseObject: ResponseObject =
          await havenAiAgentService.generateFollowUpQuestion(
            generateFollowUpQuestionDto,
          );
        expect(responseObject.summarizedStory).toBeDefined();
        expect(responseObject.isStoryGoodEnough).toBe(true);
        expect(responseObject.threadId).toBeDefined();
        expect(responseObject.response).toBeUndefined();
      });

      it('it should throw the correct error', async () => {
        jest
          .spyOn(openaiMessagesService, 'createMessage')
          .mockRejectedValueOnce(new Error());

        try {
          await havenAiAgentService.generateFollowUpQuestion(
            generateFollowUpQuestionDto,
          );
          fail('should have thrown an error');
        } catch (error) {
          expect(error).toBeInstanceOf(GenerateFollowUpQuestionException);
        }
      });
    });
  });
});

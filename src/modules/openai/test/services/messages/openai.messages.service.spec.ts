import { CreateMessageException } from 'src/modules/openai/exceptions/messages/create-message.exception';
import { ListMessagesException } from 'src/modules/openai/exceptions/messages/list-messages.exception';
import { OpenaiMessagesService } from 'src/modules/openai/services/messages/openai.messages.service';
import { openaiMock } from '../../__mocks__/openai.mock';
import { Test, TestingModule } from '@nestjs/testing';
import { UserMessage } from 'src/shared/interfaces/interfaces';
import { v4 as uuid } from 'uuid';
import OpenAI from 'openai';

describe('OpenaiMessagesService', () => {
  let openaiMessagesService: OpenaiMessagesService;
  let openai: OpenAI;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OpenaiMessagesService,
        { provide: OpenAI, useValue: openaiMock },
      ],
    }).compile();
    openaiMessagesService = module.get<OpenaiMessagesService>(
      OpenaiMessagesService,
    );
    openai = module.get<OpenAI>(OpenAI);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should be defined', () => {
    expect(openaiMessagesService).toBeDefined();
    expect(openai).toBeDefined();
  });

  describe('createMessage', () => {
    let threadId: string;
    let userMessage: UserMessage;

    beforeEach(async () => {
      threadId = uuid();
      userMessage = {
        content: 'Hello',
        role: 'user',
      };
      await openaiMessagesService.createMessage(threadId, userMessage);
    });

    it('should call openai method correctly', () => {
      expect(openai.beta.threads.messages.create).toHaveBeenCalledTimes(1);
    });

    it('should call openai service with the correct parameters', () => {
      expect(openai.beta.threads.messages.create).toHaveBeenCalledWith(
        threadId,
        userMessage,
      );
    });

    it('should return a thread message', async () => {
      const threadMessage = await openaiMessagesService.createMessage(
        threadId,
        userMessage,
      );
      expect(threadMessage).toBeDefined();
      expect(threadMessage.thread_id).toEqual(threadId);
      expect(threadMessage.role).toEqual(userMessage.role);
    });
  });

  describe('listMessages', () => {
    let threadId: string;
    let threadMessages: OpenAI.Beta.Threads.Messages.Message[];

    beforeEach(async () => {
      threadId = uuid();
      threadMessages = await openaiMessagesService.listMessages(threadId);
    });

    it('should call openai method correctly', () => {
      expect(openai.beta.threads.messages.list).toHaveBeenCalledTimes(1);
    });

    it('should call openai service with the correct parameters', () => {
      expect(openai.beta.threads.messages.list).toHaveBeenCalledWith(threadId);
    });

    it('should return an array of thread messages', async () => {
      expect(threadMessages).toBeDefined();
      expect(threadMessages.length).toEqual(1);
      expect(threadMessages[0].thread_id).toEqual(threadId);
    });
  });

  describe('exception should do its job', () => {
    describe('createMessage', () => {
      let threadId: string;
      let userMessage: UserMessage;

      beforeEach(async () => {
        threadId = uuid();
        userMessage = {
          content: 'Hello',
          role: 'user',
        };
      });

      it('should throw an error', async () => {
        jest
          .spyOn(openai.beta.threads.messages, 'create')
          .mockRejectedValue(new Error());

        try {
          await openaiMessagesService.createMessage(threadId, userMessage);
          fail('should have thrown an error');
        } catch (error) {
          expect(error).toBeInstanceOf(CreateMessageException);
        }
      });
    });
    describe('listMessages', () => {
      let threadId: string;

      beforeEach(async () => {
        threadId = uuid();
      });

      it('should throw an error', async () => {
        jest
          .spyOn(openai.beta.threads.messages, 'list')
          .mockRejectedValue(new Error());

        try {
          await openaiMessagesService.listMessages(threadId);
          fail('should have thrown an error');
        } catch (error) {
          expect(error).toBeInstanceOf(ListMessagesException);
        }
      });
    });
  });
});

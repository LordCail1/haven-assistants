import { ConfigService } from '@nestjs/config';
import { CreateThreadException } from 'src/modules/openai/exceptions/threads/create-thread.exception';
import { HttpStatus } from '@nestjs/common';
import { openaiMock } from '../../__mocks__/openai.mock';
import { OpenaiThreadsService } from '../../../services/threads/openai.threads.service';
import { Test, TestingModule } from '@nestjs/testing';
import { ThreadCreateParams } from 'openai/resources/beta/threads/threads';
import OpenAI from 'openai';
import { threadCreateParamsStub } from '../../stubs/openai.threadCreateParams.stub';
import { v4 as uuid } from 'uuid';

describe('OpenaiThreadsService', () => {
  let openaiThreadsService: OpenaiThreadsService;
  let openai: OpenAI;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OpenaiThreadsService,
        { provide: OpenAI, useValue: openaiMock },
        ConfigService,
      ],
    }).compile();
    openaiThreadsService =
      module.get<OpenaiThreadsService>(OpenaiThreadsService);
    openai = module.get<OpenAI>(OpenAI);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should be defined', () => {
    expect(openaiThreadsService).toBeDefined();
    expect(openai).toBeDefined();
  });

  describe('createThread', () => {
    let threadCreateParams: ThreadCreateParams;

    beforeEach(async () => {
      threadCreateParams = threadCreateParamsStub();
    });

    it('should call openai.beta.threads.create', async () => {
      await openaiThreadsService.createThread(threadCreateParams);
      expect(openai.beta.threads.create).toHaveBeenCalledWith(
        threadCreateParams,
      );
    });

    it('should return a thread', async () => {
      const result =
        await openaiThreadsService.createThread(threadCreateParams);
      expect(result).toBeDefined();
    });
  });

  describe('deleteThread', () => {
    let threadId: string;

    beforeEach(async () => {
      threadId = uuid();
    });

    it('should call openai.beta.threads.del', async () => {
      await openaiThreadsService.deleteThread(threadId);
      expect(openai.beta.threads.del).toHaveBeenCalledWith(threadId);
    });

    it('should return a thread', async () => {
      const result = await openaiThreadsService.deleteThread(threadId);
      expect(result).toBeDefined();
    });
  });

  describe('exception should od its job', () => {
    let threadCreateParams: ThreadCreateParams;

    beforeEach(async () => {
      threadCreateParams = threadCreateParamsStub();
    });

    it('should throw an error', async () => {
      jest.spyOn(openai.beta.threads, 'create').mockRejectedValue(new Error());

      try {
        await openaiThreadsService.createThread(threadCreateParams);
        fail('The service did not throw the expected exception'); // This ensures the test fails if no exception is thrown
      } catch (error) {
        expect(error).toBeInstanceOf(CreateThreadException);
        expect(error.status).toEqual(HttpStatus.INTERNAL_SERVER_ERROR);
      }
    });
  });
});

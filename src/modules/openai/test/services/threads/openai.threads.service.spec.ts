import { ConfigService } from '@nestjs/config';
import { openaiMock } from '../../__mocks__/openai.stub';
import { OpenaiThreadsService } from '../../../services/threads/openai.threads.service';
import { Test, TestingModule } from '@nestjs/testing';
import OpenAI from 'openai';
import { ThreadCreateParams } from 'openai/resources/beta/threads/threads';

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

  it('should be defined', () => {
    expect(openaiThreadsService).toBeDefined();
    expect(openai).toBeDefined();
  });

  describe('createThread', () => {
    let threadCreateParams: ThreadCreateParams;

    beforeEach(async () => {
      threadCreateParams = {
        messages: [{ content: 'Hello', role: 'user' }],
      };
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
});

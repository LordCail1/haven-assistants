import { CreateRunException } from 'src/modules/openai/exceptions/runs/create-run.exception';
import { openaiMock } from '../../__mocks__/openai.mock';
import { OpenaiRunsService } from 'src/modules/openai/services/runs/openai.runs.service';
import { Run } from 'openai/resources/beta/threads/runs/runs';
import { Test, TestingModule } from '@nestjs/testing';
import { v4 as uuid } from 'uuid';
import OpenAI from 'openai';
import { RetrieveRunException } from 'src/modules/openai/exceptions/runs/retrieve-run.exception';
import { MyLogger } from 'src/modules/logger/services/logger.service';
import { MyLoggerMock } from 'src/modules/logger/test/__mocks__/logger.service.mock';
import { ConfigService } from '@nestjs/config';

describe('OpenaiRunsService', () => {
  let openaiRunsService: OpenaiRunsService;
  let openai: OpenAI;
  let myLogger: MyLogger;
  let configService: ConfigService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OpenaiRunsService,
        { provide: OpenAI, useValue: openaiMock },
        { provide: MyLogger, useValue: MyLoggerMock },
        { provide: ConfigService, useValue: { get: jest.fn() } },
      ],
    }).compile();

    openaiRunsService = module.get<OpenaiRunsService>(OpenaiRunsService);
    openai = module.get<OpenAI>(OpenAI);
    myLogger = module.get<MyLogger>(MyLogger);
    configService = module.get<ConfigService>(ConfigService);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should be defined', () => {
    expect(openaiRunsService).toBeDefined();
    expect(openai).toBeDefined();
    expect(myLogger).toBeDefined();
    expect(configService).toBeDefined();
  });

  describe('createRun', () => {
    let threadId: string;
    let assistantId: string;
    let run: Run;

    beforeEach(async () => {
      threadId = uuid();
      assistantId = uuid();
      run = await openaiRunsService.createRun(threadId, assistantId);
    });

    it('should call the openai beta threads runs create method', () => {
      expect(openai.beta.threads.runs.create).toHaveBeenCalledTimes(1);
    });

    it('should return a run object', () => {
      expect(run).toBeDefined();
      expect(run.thread_id).toEqual(threadId);
      expect(run.assistant_id).toEqual(assistantId);
    });
  });

  describe('retrieveRun', () => {
    let threadId: string;
    let runId: string;
    let run: Run;

    beforeEach(async () => {
      threadId = uuid();
      runId = uuid();
      run = await openaiRunsService.retrieveRun(threadId, runId);
    });

    it('should call the openai beta threads runs retrieve method', () => {
      expect(openai.beta.threads.runs.retrieve).toHaveBeenCalledTimes(1);
    });

    it('should return a run object', () => {
      expect(run).toBeDefined();
      expect(run.thread_id).toEqual(threadId);
    });
  });

  describe('exception should do its job', () => {
    describe('createRun', () => {
      let threadId: string;
      let assistantId: string;

      beforeEach(async () => {
        threadId = uuid();
        assistantId = uuid();
      });

      it('should throw an error', async () => {
        jest
          .spyOn(openai.beta.threads.runs, 'create')
          .mockRejectedValue(new Error());

        try {
          await openaiRunsService.createRun(threadId, assistantId);
          fail('The service did not throw the expected exception'); // This ensures the test fails if no exception is thrown
        } catch (error) {
          expect(error).toBeInstanceOf(CreateRunException);
        }
      });
    });

    describe('retrieveRun', () => {
      let threadId: string;
      let runId: string;

      beforeEach(async () => {
        threadId = uuid();
        runId = uuid();
      });

      it('should throw an error', async () => {
        jest
          .spyOn(openai.beta.threads.runs, 'retrieve')
          .mockRejectedValue(new Error());

        try {
          await openaiRunsService.retrieveRun(threadId, runId);
          fail('The service did not throw the expected exception'); // This ensures the test fails if no exception is thrown
        } catch (error) {
          expect(error).toBeInstanceOf(RetrieveRunException);
        }
      });
    });
  });
});

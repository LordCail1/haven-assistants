import { APP_PIPE } from '@nestjs/core';
import { AppModule } from './../src/app.module';
import { AssistantsRefugeeService } from 'src/modules/assistants/services/refugee/assistants.refugee.service';
import { Connection } from 'mongoose';
import { DatabaseService } from 'src/modules/database/services/database.service';
import { GenerateFollowUpQuestionDto } from 'src/modules/haven-ai-agent/dto/generate-followup-question.dto';
import { ImageNotTextException } from 'src/shared/exceptions/image-not-text.exception';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { OpenaiMessagesService } from 'src/modules/openai/services/messages/openai.messages.service';
import { OpenaiRunsService } from 'src/modules/openai/services/runs/openai.runs.service';
import { OpenaiThreadsService } from 'src/modules/openai/services/threads/openai.threads.service';
import { ResponseObject } from 'src/modules/haven-ai-agent/interfaces/interfaces';
import { Run } from 'openai/resources/beta/threads/runs/runs';
import { Test, TestingModule } from '@nestjs/testing';
import { Thread } from 'openai/resources/beta/threads/threads';
import { turkey_Emre } from './__mocks__/refugees/turkey/refugees.turkey.mock';
import * as request from 'supertest';
import { ukrain_Olena } from './__mocks__/refugees/ukrain/refugees.ukrain.mock';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let httpServer: any;
  let openaiThreadsService: OpenaiThreadsService;
  let openaiMessagesService: OpenaiMessagesService;
  let openaiRunsService: OpenaiRunsService;
  let assistantsRefugeeService: AssistantsRefugeeService;
  let dbConnection: Connection;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
      providers: [{ provide: APP_PIPE, useValue: new ValidationPipe() }],
    }).compile();

    openaiThreadsService =
      moduleFixture.get<OpenaiThreadsService>(OpenaiThreadsService);
    openaiMessagesService = moduleFixture.get<OpenaiMessagesService>(
      OpenaiMessagesService,
    );
    openaiRunsService = moduleFixture.get<OpenaiRunsService>(OpenaiRunsService);
    assistantsRefugeeService = moduleFixture.get<AssistantsRefugeeService>(
      AssistantsRefugeeService,
    );
    dbConnection = moduleFixture
      .get<DatabaseService>(DatabaseService)
      .getDbHandle();

    await dbConnection.close();

    app = moduleFixture.createNestApplication();
    httpServer = app.getHttpServer();
    await app.init();
  });

  afterAll(async () => {
    await dbConnection.close();
    await app.close();
  });

  it('services should be defined', () => {
    expect(openaiThreadsService).toBeDefined();
    expect(openaiMessagesService).toBeDefined();
    expect(openaiRunsService).toBeDefined();
  });

  describe('first question', () => {
    it('/api/v1/haven-ai-agent/generate-first-question (POST)', async () => {
      const response = await request(httpServer)
        .post('/api/v1/haven-ai-agent/generate-first-question')
        .send(ukrain_Olena);

      await loopUntilStoryIsGoodEnough(response.body);
    }, 600000);
  });

  async function loopUntilStoryIsGoodEnough(responseObject: ResponseObject) {
    const { threadId, isStoryGoodEnough } = responseObject;

    if (isStoryGoodEnough) {
      console.log('STORY FINISHED');
    } else {
      console.log(responseObject.response);
      const refugeeResponse: string = await refugeeAnswering(
        responseObject.response,
      );
      console.log(refugeeResponse);

      const generateFollowUpQuestionDto: GenerateFollowUpQuestionDto = {
        refugeeResponse,
        threadId,
      };

      const nextResponse = await request(httpServer)
        .post('/api/v1/haven-ai-agent/generate-follow-up-question')
        .send(generateFollowUpQuestionDto);

      await loopUntilStoryIsGoodEnough(nextResponse.body);
    }
  }

  async function refugeeAnswering(generatedQuestion: string): Promise<string> {
    const newThread: Thread = await openaiThreadsService.createThread();
    await openaiMessagesService.createMessage(newThread.id, {
      role: 'user',
      content: generatedQuestion,
    });

    const run: Run = await openaiRunsService.createRun(
      newThread.id,
      assistantsRefugeeService.getAssistant().id,
    );

    await openaiRunsService.retrieveRun(newThread.id, run.id);
    const data = await openaiMessagesService.listMessages(newThread.id);

    let responseText: string;
    if ('text' in data[0].content[0]) {
      responseText = data[0].content[0].text.value;
    } else {
      throw new ImageNotTextException();
    }

    return responseText;
  }
});

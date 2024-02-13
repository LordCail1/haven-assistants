import { APP_PIPE } from '@nestjs/core';
import { AppModule } from './../src/app.module';
import { AssistantsRefugeeService } from 'src/modules/assistants/services/refugee/assistants.refugee.service';
import { bearer_token } from 'src/shared/constants';
import { ConfigService } from '@nestjs/config';
import { GenerateFollowUpQuestionDto } from 'src/modules/haven-ai-agent/dto/generate-followUp-question.dto';
import { ImageNotTextException } from 'src/shared/exceptions/image-not-text.exception';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { OpenaiMessagesService } from 'src/modules/openai/services/messages/openai.messages.service';
import { OpenaiRunsService } from 'src/modules/openai/services/runs/openai.runs.service';
import { OpenaiThreadsService } from 'src/modules/openai/services/threads/openai.threads.service';
import { ResponseObject } from 'src/modules/haven-ai-agent/dto/response-object.dto';
import { Run } from 'openai/resources/beta/threads/runs/runs';
import { Test, TestingModule } from '@nestjs/testing';
import { Thread } from 'openai/resources/beta/threads/threads';
import * as request from 'supertest';
import { MyLogger } from 'src/modules/logger/services/logger.service';
import { ali_complete } from './__mocks__/refugees/second_generation/Ali/complete/refugees.ali.complete.mock';



describe('AppController (e2e)', () => {
  let app: INestApplication;
  let httpServer: any;
  let openaiThreadsService: OpenaiThreadsService;
  let openaiMessagesService: OpenaiMessagesService;
  let openaiRunsService: OpenaiRunsService;
  let assistantsRefugeeService: AssistantsRefugeeService;
  let configService: ConfigService;
  let myLogger: MyLogger;

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
    configService = moduleFixture.get<ConfigService>(ConfigService);
    myLogger = moduleFixture.get<MyLogger>(MyLogger);

    app = moduleFixture.createNestApplication();
    httpServer = app.getHttpServer();
    await app.init();
  }, 600000);

  afterAll(async () => {
    await app.close();
  });

  it('services should be defined', () => {
    expect(openaiThreadsService).toBeDefined();
    expect(openaiMessagesService).toBeDefined();
    expect(openaiRunsService).toBeDefined();
    expect(assistantsRefugeeService).toBeDefined();
    expect(configService).toBeDefined();

    expect(myLogger).toBeDefined();

  });

  describe('BearerTokenGuard', () => {
    it('should grant access with a valid bearer token', async () => {
      const secretToken = configService.get<string>(bearer_token); // Replace YOUR_VALID_TOKEN with the actual token
      const response = await request(httpServer)
        .post('/api/v1/haven-ai-agent/generate-first-question') // Use the correct endpoint
        .set('Authorization', `Bearer ${secretToken}`)
        .send(ali_complete);

      expect(response.statusCode).not.toBe(401); // Assuming a successful request does not return 401
    }, 600000);

    it('should deny access without a bearer token', async () => {
      const response = await request(httpServer)
        .post('/api/v1/haven-ai-agent/generate-first-question') // Use the correct endpoint
        .send(ali_complete);

      expect(response.statusCode).toBe(401); // Expecting a 401 Unauthorized response
    }, 600000);
  });

  describe.only('first question', () => {
    it('/api/v1/haven-ai-agent/generate-first-question (POST)', async () => {
      const secretToken = configService.get<string>(bearer_token);
      const startTime = Date.now();
      const response = await request(httpServer)
        .post('/api/v1/haven-ai-agent/generate-first-question')
        .set('Authorization', `Bearer ${secretToken}`)

   
      

        .send(ali_complete);
      myLogger.test('this is how long it took', Date.now() - startTime);



      await loopUntilStoryIsGoodEnough(response.body, secretToken);
    }, 600000);
  });

  async function loopUntilStoryIsGoodEnough(
    responseObject: ResponseObject,
    secretToken: string,
  ) {
    const { threadId, isStoryGoodEnough } = responseObject;

    if (isStoryGoodEnough) {
      myLogger.test('STORY FINISHED');
    } else {
      myLogger.test(`interview question:
      ${responseObject.response}`);
      const refugeeResponse: string = await refugeeAnswering(
        responseObject.response,
      );
      myLogger.test(`user response:
      ${refugeeResponse}`);

      const generateFollowUpQuestionDto: GenerateFollowUpQuestionDto = {
        refugeeResponse,
        threadId,
      };

      const nextResponse = await request(httpServer)
        .post('/api/v1/haven-ai-agent/generate-follow-up-question')
        .set('Authorization', `Bearer ${secretToken}`)
        .send(generateFollowUpQuestionDto);

      await loopUntilStoryIsGoodEnough(nextResponse.body, secretToken);
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

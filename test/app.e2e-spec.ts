import { APP_PIPE } from '@nestjs/core';
import { AppModule } from './../src/app.module';
import { AssistantsRefugeeService } from 'src/modules/assistants/services/refugee/assistants.refugee.service';
import { Connection } from 'mongoose';
import { DatabaseService } from 'src/modules/database/services/database.service';
import { GenerateFirstQuestionDto } from 'src/modules/haven-ai-agent/dto/generate-first-question.dto';
import { GenerateFollowUpQuestionDto } from 'src/modules/haven-ai-agent/dto/generate-followup-question.dto';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { OpenaiMessagesService } from 'src/modules/openai/services/openai.messages.service';
import { OpenaiRunsService } from 'src/modules/openai/services/openai.runs.service';
import { OpenaiThreadsService } from 'src/modules/openai/services/openai.threads.service';
import { ResponseObject } from 'src/modules/haven-ai-agent/interfaces/interfaces';
import { Run } from 'openai/resources/beta/threads/runs/runs';
import { Test, TestingModule } from '@nestjs/testing';
import { Thread } from 'openai/resources/beta/threads/threads';
import * as request from 'supertest';

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
      const generateFirstQuestionDto: GenerateFirstQuestionDto = {
        name: 'Ahmed',
        familyName: 'Al-Mustafa',
        email: 'ahmed.mustafa@example.com',
        gender: 'Male',
        highestEducation: "Bachelor's Degree",
        languages: ['Arabic', 'English'],
        myStory:
          'I am originally from Syria and have been living in a refugee camp in Turkey for the past three years. I hope to start a new life in Canada.',
        CountryOfBirth: 'Syria',
        familyStructure: 'Family with children',
        howManyPeopleInYourGroup: 4,
        resettlementProvinceOrTerritory: 'Ontario',
        stageOfResettlement: 'Application Submitted',
        resettlementCity: 'Toronto',
        currentCity: 'Istanbul',
        currentCountry: 'Turkey',
        currentProvinceOrTerritory: 'Istanbul',
      };
      const response = await request(httpServer)
        .post('/api/v1/haven-ai-agent/generate-first-question')
        .send(generateFirstQuestionDto);

      await loopUntilStoryIsGoodEnough(response.body);
    }, 120000);
  });

  async function loopUntilStoryIsGoodEnough(responseObject: ResponseObject) {
    const {
      threadId,
      isStoryGoodEnough,
      response: QuestionerResponse,
    } = responseObject;

    if (isStoryGoodEnough) {
      console.log('STORY FINISHED');
    } else {
      console.log(QuestionerResponse);
      const refugeeResponse: string =
        await refugeeAnswering(QuestionerResponse);
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

    const run: Run = await openaiRunsService.runThread(
      newThread.id,
      assistantsRefugeeService.getAssistant().id,
    );

    await openaiRunsService.retrieveRun(newThread.id, run.id);
    const data = await openaiMessagesService.listMessages(newThread.id);

    let responseText: string;
    if ('text' in data[0].content[0]) {
      responseText = data[0].content[0].text.value;
    }

    return responseText;
  }
});

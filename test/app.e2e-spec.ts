import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { GenerateFirstQuestionDto } from 'src/modules/haven-ai-agent/dto/generate-first-question.dto';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let httpServer: any;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    httpServer = app.getHttpServer();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/api/v1/haven-ai-agent/generate-first-question (POST)', async () => {
    const generateFirstQuestionDto: GenerateFirstQuestionDto = {
      name: 'John Doe',
      familyName: 'Doe',
      email: 'johndoe@example.com',
      gender: 'Male',
      highestEducation: 'Bachelor',
      languages: ['English', 'Spanish'],
      myStory: 'This is a test story',
      CountryOfBirth: 'USA',
      familyStructure: 'Single',
      howManyPeopleInYourGroup: 1,
      resettlementProvinceOrTerritory: 'Ontario',
      stageOfResettlement: 'Initial',
      resettlementCity: 'Toronto',
      currentCity: 'New York',
      currentCountry: 'USA',
      currentProvinceOrTerritory: 'New York',
    };
    const response = await request(httpServer)
      .post('/api/v1/haven-ai-agent/generate-first-question')
      .send(generateFirstQuestionDto);

    const responseFromAI = response.body[0].content[0].text.value;
    console.log(responseFromAI);
  });
});

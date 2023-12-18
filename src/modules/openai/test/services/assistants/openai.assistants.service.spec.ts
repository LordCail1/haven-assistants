/* eslint-disable @typescript-eslint/no-unused-vars */
import { OpenaiAssistantsService } from 'src/modules/openai/services/assistants/openai.assistants.service';
import { Test, TestingModule } from '@nestjs/testing';
import OpenAI from 'openai';
import { openaiMock } from '../../__mocks__/openai.mock';
import {
  Assistant,
  AssistantCreateParams,
  AssistantDeleted,
  AssistantsPage,
} from 'openai/resources/beta/assistants/assistants';
import { Gpt_Models } from 'src/modules/openai/enums/enums';
import { ListAllAssistantsException } from 'src/modules/openai/exceptions/assistants/list-all-assistants.exception';
import { CreateAssistantException } from 'src/modules/openai/exceptions/assistants/create-assistant.exception';
import { DeleteAssistantException } from 'src/modules/openai/exceptions/assistants/delete-assistant.exception';

describe('OpenaiAssistantsService', () => {
  let openaiAssistantsService: OpenaiAssistantsService;
  let openai: OpenAI;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OpenaiAssistantsService,
        { provide: OpenAI, useValue: openaiMock },
      ],
    }).compile();

    openaiAssistantsService = module.get<OpenaiAssistantsService>(
      OpenaiAssistantsService,
    );
    openai = module.get<OpenAI>(OpenAI);
  });

  it('should be defined', () => {
    expect(openaiAssistantsService).toBeDefined();
    expect(openai).toBeDefined();
  });

  describe('listAllAssistants', () => {
    let assistantPage: AssistantsPage;

    beforeEach(async () => {
      assistantPage = await openaiAssistantsService.listAllAssistants();
    });

    it('should call openai method correctly', () => {
      expect(openai.beta.assistants.list).toHaveBeenCalledTimes(1);
    });

    it('should return an array of assistants', async () => {
      const assistants = await openaiAssistantsService.listAllAssistants();
      expect(assistants).toBeDefined();
    });
  });

  describe('createAssistant', () => {
    let assistantCreateParams: AssistantCreateParams;
    let assistant: Assistant;

    beforeEach(async () => {
      assistantCreateParams = {
        name: 'test',
        model: Gpt_Models.GPT_4_TURBO_1106_PREVIEW,
        description: 'test',
        file_ids: [],
        instructions: 'test',
      };

      assistant = await openaiAssistantsService.createAssistant(
        assistantCreateParams,
      );
    });

    it('should call openai method correctly', async () => {
      expect(openai.beta.assistants.create).toHaveBeenCalledTimes(1);
    });

    it('should call openai service with the correct parameters', () => {
      expect(openai.beta.assistants.create).toHaveBeenCalledWith(
        assistantCreateParams,
      );
    });

    it('should return an assistant', async () => {
      expect(assistant).toBeDefined();
      expect(assistant.name).toEqual(assistantCreateParams.name);
    });
  });

  describe('deleteAssistant', () => {
    let assistantId: string;
    let assistantDeleted: AssistantDeleted;

    beforeEach(async () => {
      assistantId = 'test';
      assistantDeleted =
        await openaiAssistantsService.deleteAssistant(assistantId);
    });

    it('should call openai method correctly', () => {
      expect(openai.beta.assistants.del).toHaveBeenCalledTimes(1);
    });

    it('should call openai service with the correct parameters', () => {
      expect(openai.beta.assistants.del).toHaveBeenCalledWith(assistantId);
    });

    it('should return an assistant deleted object', () => {
      expect(assistantDeleted).toBeDefined();
      expect(assistantDeleted.id).toEqual(assistantId);
    });
  });

  describe('exception should do its job', () => {
    describe('listAllAssistants', () => {
      it('should throw an exception', async () => {
        jest
          .spyOn(openai.beta.assistants, 'list')
          .mockRejectedValue(new Error());
        try {
          await openaiAssistantsService.listAllAssistants();
          fail('should have thrown an error');
        } catch (error) {
          expect(error).toBeInstanceOf(ListAllAssistantsException);
        }
      });
    });

    describe('createAssistant', () => {
      let assistantCreateParams: AssistantCreateParams;

      beforeEach(() => {
        assistantCreateParams = {
          name: 'test',
          model: Gpt_Models.GPT_4_TURBO_1106_PREVIEW,
        };
      });

      it('should throw an exception', async () => {
        jest
          .spyOn(openai.beta.assistants, 'create')
          .mockRejectedValue(new Error());
        try {
          await openaiAssistantsService.createAssistant(assistantCreateParams);
          fail('should have thrown an error');
        } catch (error) {
          expect(error).toBeInstanceOf(CreateAssistantException);
        }
      });
    });

    describe('deleteAssistant', () => {
      let assistantId: string;

      beforeEach(() => {
        assistantId = 'test';
      });

      it('should throw an exception', async () => {
        jest
          .spyOn(openai.beta.assistants, 'del')
          .mockRejectedValue(new Error());
        try {
          await openaiAssistantsService.deleteAssistant(assistantId);
        } catch (error) {
          expect(error).toBeInstanceOf(DeleteAssistantException);
        }
      });
    });
  });
});

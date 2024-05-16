import { HelpersService } from '../services/helpers.service';
import { ImageNotTextException } from 'src/shared/exceptions/image-not-text.exception';
import { IsNotBooleanException } from '../exceptions/is-not-boolean.exception';
import { ParseLastResponseForJsonException } from '../exceptions/parse-last-response-for-json.exception';
import { Test, TestingModule } from '@nestjs/testing';
import { v4 as uuid } from 'uuid';
import OpenAI from 'openai';

describe('HelpersService', () => {
  let helpersService: HelpersService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HelpersService],
    }).compile();

    helpersService = module.get<HelpersService>(HelpersService);
  });

  it('should be defined', () => {
    expect(helpersService).toBeDefined();
  });

  describe('parseTerminatorResponseForJson', () => {
    describe('it should work with weird variations', () => {
      it('should work with the second typical version of JSON returned', () => {
        const response: string = '```json{"isStoryGoodEnough": true}```';
        const result = helpersService.parseTerminatorResponseForJson(response);
        expect(result).toBe(true);
      });
      it('should work with other weird variations v1', () => {
        const response: string = '``wef`json{"isStoryGoodEnough": true}`````';
        const result = helpersService.parseTerminatorResponseForJson(response);
        expect(result).toBe(true);
      });
    });

    it('should return true if the response is true', () => {
      const response: string = '{"isStoryGoodEnough": true}';
      const result = helpersService.parseTerminatorResponseForJson(response);
      expect(result).toBe(true);
    });

    it('should return false if the response is false', () => {
      const response: string = '{"isStoryGoodEnough": false}';
      const result = helpersService.parseTerminatorResponseForJson(response);
      expect(result).toBe(false);
    });

    it('should throw IsNotBooleanException if the response is not a boolean', () => {
      const response: string = '{"isStoryGoodEnough": "true"}';
      expect(() => {
        helpersService.parseTerminatorResponseForJson(response);
      }).toThrow(IsNotBooleanException);
    });

    it('should throw ParseLastResponseForJsonException if the response is not a valid JSON', () => {
      const response: string = 'This is not a valid JSON';
      expect(() => {
        helpersService.parseTerminatorResponseForJson(response);
      }).toThrow(ParseLastResponseForJsonException);
    });
  });

  describe('convertThreadMessagesToMessageArray', () => {
    let threadMessages: OpenAI.Beta.Threads.Messages.Message[];

    it('should work if the thread messages are in the right format', async () => {
      threadMessages = [
        {
          id: uuid(),
          assistant_id: uuid(),
          content: [
            {
              text: {
                value: 'random Text',
                annotations: [],
              },
              type: 'text',
            },
          ],
          created_at: new Date().getTime(),
          attachments: null,
          completed_at: null,
          incomplete_at: null,
          incomplete_details: null,
          status: 'completed',
          object: 'thread.message',
          run_id: uuid(),
          thread_id: uuid(),
          metadata: null,
          role: 'user',
        },
      ];

      const result =
        helpersService.convertThreadMessagesToMessageArray(threadMessages);
      expect(result[0].content).toBe('random Text');
      expect(result[0].role).toBe('user');
    });

    it('should throw ImageNotTextException if the thread messages are in the wrong format', async () => {
      threadMessages = [
        {
          id: uuid(),
          assistant_id: uuid(),
          content: [
            {
              image_file: {
                file_id: uuid(),
              },
              type: 'image_file',
            },
          ],
          created_at: new Date().getTime(),
          attachments: null,
          completed_at: null,
          incomplete_at: null,
          incomplete_details: null,
          status: 'completed',
          object: 'thread.message',
          run_id: uuid(),
          thread_id: uuid(),
          metadata: null,
          role: 'user',
        },
      ];

      expect(() => {
        helpersService.convertThreadMessagesToMessageArray(threadMessages);
      }).toThrow(ImageNotTextException);
    });
  });
});

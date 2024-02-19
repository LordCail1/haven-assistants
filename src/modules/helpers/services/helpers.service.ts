import { HttpException, Injectable } from '@nestjs/common';
import { ImageNotTextException } from 'src/shared/exceptions/image-not-text.exception';
import { IsNotBooleanException } from '../exceptions/is-not-boolean.exception';
import { MessageConversionException } from '../exceptions/message-conversion.exception';
import { ParseLastResponseForJsonException } from '../exceptions/parse-last-response-for-json.exception';
import { ThreadCreateParams } from 'openai/resources/beta/threads/threads';
import { ThreadMessage } from 'openai/resources/beta/threads/messages/messages';

/**
 * This service is a helper service. It groups together some helper functions
 * that do not have any particular domain.
 */
@Injectable()
export class HelpersService {
  /**
   * This method is responsible for parsing the last response from the AI
   * @param response The response from the AI
   * @returns A boolean that indicates whether the story is good enough
   */
  parseTerminatorResponseForJson(response: string): boolean {
    try {
      // Regex to extract JSON content from the response
      const jsonMatch = response.match(/\{.*?\}/s);
      if (!jsonMatch) {
        throw new Error('No JSON found in response');
      }
      const cleanResponse = jsonMatch[0];

      const parsedJson = JSON.parse(cleanResponse);
      const isStoryGoodEnough = parsedJson.isStoryGoodEnough;
      if (typeof isStoryGoodEnough !== 'boolean') {
        throw new IsNotBooleanException('isStoryGoodEnough');
      }
      return isStoryGoodEnough;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      } else {
        throw new ParseLastResponseForJsonException(error);
      }
    }
  }

  /**
   * Converts the thread messages from one format to another
   * @param threadMessages The thread messages that are in wrong format
   * @returns An array of messages that is in the right format
   */
  convertThreadMessagesToMessageArray(
    threadMessages: ThreadMessage[],
  ): ThreadCreateParams.Message[] {
    try {
      return threadMessages.map((message: ThreadMessage) => {
        if ('text' in message.content[0]) {
          return {
            content: message.content[0].text.value,
            role: 'user',
          };
        } else {
          throw new ImageNotTextException();
        }
      });
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      } else {
        throw new MessageConversionException(error);
      }
    }
  }
}

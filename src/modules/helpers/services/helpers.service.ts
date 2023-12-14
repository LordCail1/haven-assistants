import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
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
  parseLastResponseForJson(response: string): boolean {
    console.log(response);
    try {
      const parsedJson = JSON.parse(response);
      const isStoryGoodEnough = parsedJson.isStoryGoodEnough;
      if (typeof isStoryGoodEnough !== 'boolean') {
        throw new HttpException(
          'isStoryGoodEnough is not a boolean',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
      return isStoryGoodEnough;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      } else {
        throw new HttpException(
          'something went wrong parsinng the json!',
          HttpStatus.INTERNAL_SERVER_ERROR,
          { cause: error },
        );
      }
    }
  }

  /**
   * Converts the thread messages from one format to another
   * @param threadMessages The thread messages that are in wrong format
   * @returns An array of messages that is in the right format
   */
  async convertThreadMessagesToMessageArray(
    threadMessages: ThreadMessage[],
  ): Promise<ThreadCreateParams.Message[]> {
    try {
      return threadMessages.map((message: ThreadMessage) => {
        if ('text' in message.content[0]) {
          return {
            content: message.content[0].text.value,
            role: 'user',
          };
        } else {
          throw new HttpException(
            'An image was trying to be sent instead of text from the AI!',
            HttpStatus.INTERNAL_SERVER_ERROR,
          );
        }
      });
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      } else {
        throw new HttpException(
          'something went wrong converting the thread messages to the correct format',
          HttpStatus.INTERNAL_SERVER_ERROR,
          { cause: error },
        );
      }
    }
  }
}

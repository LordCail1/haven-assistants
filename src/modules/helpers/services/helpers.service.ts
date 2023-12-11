import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ThreadCreateParams } from 'openai/resources/beta/threads/threads';
import { ThreadMessage } from 'openai/resources/beta/threads/messages/messages';

@Injectable()
export class HelpersService {
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
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'something went wrong parsinng the json!',
          errorDetails: error,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Converts the thread messages from one format to another
   * @param threadMessages the thread messages that are in the format 'ThreadMessage[]'
   * @returns an array of messages that is in the format 'Message[]'
   */
  async convertThreadMessagesToMessageArray(
    threadMessages: ThreadMessage[],
  ): Promise<ThreadCreateParams.Message[]> {
    return threadMessages.map((message: ThreadMessage) => {
      if ('text' in message.content[0]) {
        return {
          content: message.content[0].text.value,
          role: 'user',
        };
      } else {
        throw new HttpException(
          'an image was trying to be sent instead of text from the AI!',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    });
  }
}

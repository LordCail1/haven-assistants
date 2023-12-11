import { Injectable } from '@nestjs/common';
import { ThreadMessage } from 'openai/resources/beta/threads/messages/messages';
import { ThreadCreateParams } from 'openai/resources/beta/threads/threads';

@Injectable()
export class HelpersService {
  parseLastResponseForJson(response: string): boolean {
    console.log(response);
    try {
      const parsedJson = JSON.parse(response);
      const isStoryGoodEnough = parsedJson.isStoryGoodEnough;
      if (typeof isStoryGoodEnough !== 'boolean') {
        throw new Error('isStoryGoodEnough is not a boolean');
      }
      return isStoryGoodEnough;
    } catch (error) {
      console.log('something went wrong parsinng the json!', error);
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
        throw new Error('Message content contained files is not text');
      }
    });
  }
}

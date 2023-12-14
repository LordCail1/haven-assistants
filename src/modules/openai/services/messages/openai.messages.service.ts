import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { OpenaiAbstractService } from '../openai.abstract.service';
import { ThreadMessage } from 'openai/resources/beta/threads/messages/messages';
import { UserMessage } from 'src/shared/interfaces/interfaces';

/**
 * This service is responsible for interacting with the OpenAI messages API
 * https://platform.openai.com/docs/api-reference/messages
 */
@Injectable()
export class OpenaiMessagesService extends OpenaiAbstractService {
  async createMessage(
    threadId: string,
    userMessage: UserMessage,
  ): Promise<ThreadMessage> {
    try {
      return await this.openai.beta.threads.messages.create(
        threadId,
        userMessage,
      );
    } catch (error) {
      throw new HttpException(
        {
          message: 'The message could not be created',
          error,
          threadId,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * this method is responsible for listing all the messages in a thread
   * @param threadId - the thread id associated with the run
   * @returns an array of messages
   */
  async listMessages(threadId: string): Promise<ThreadMessage[]> {
    try {
      const { data } = await this.openai.beta.threads.messages.list(threadId);
      return data;
    } catch (error) {
      throw new HttpException(
        {
          message: 'The messages could not be listed',
          error,
          threadId,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}

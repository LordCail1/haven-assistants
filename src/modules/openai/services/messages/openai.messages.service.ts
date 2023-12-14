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
  /**
   * Creates a message in a thread
   * @param threadId The thread id associated with the thread where the message will be created
   * @param userMessage The message that will be created
   * @returns A thread message
   */
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
          threadId,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
        { cause: error },
      );
    }
  }

  /**
   * This method is responsible for listing all the messages in a thread
   * @param threadId The thread id associated with the run
   * @returns An array of thread messages
   */
  async listMessages(threadId: string): Promise<ThreadMessage[]> {
    try {
      const { data } = await this.openai.beta.threads.messages.list(threadId);
      return data;
    } catch (error) {
      throw new HttpException(
        {
          message: 'The messages could not be listed',
          threadId,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
        { cause: error },
      );
    }
  }
}

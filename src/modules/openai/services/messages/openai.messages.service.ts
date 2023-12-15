import { CreateMessageException } from '../../exceptions/messages/create-message.exception';
import { Injectable } from '@nestjs/common';
import { ListMessagesException } from '../../exceptions/messages/list-messages.exception';
import { ThreadMessage } from 'openai/resources/beta/threads/messages/messages';
import { UserMessage } from 'src/shared/interfaces/interfaces';
import OpenAI from 'openai';

/**
 * This service is responsible for interacting with the OpenAI messages API
 * https://platform.openai.com/docs/api-reference/messages
 */
@Injectable()
export class OpenaiMessagesService {
  constructor(private openai: OpenAI) {}
  /**
   * Creates a message in a thread
   * @param threadId The thread id
   * @param userMessage The message
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
      throw new CreateMessageException(threadId, error);
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
      throw new ListMessagesException(threadId, error);
    }
  }
}

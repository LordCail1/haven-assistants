import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import {
  ThreadCreateParams,
  Thread,
} from 'openai/resources/beta/threads/threads';
import { OpenaiAbstractService } from '../openai.abstract.service';

/**
 * This service is responsible for interacting with the OpenAI threads API
 * https://platform.openai.com/docs/api-reference/threads
 */
@Injectable()
export class OpenaiThreadsService extends OpenaiAbstractService {
  /**
   * Creates a new thread
   * https://platform.openai.com/docs/api-reference/threads/createThread
   * @param threadCreateParams Optional array of thread messages
   */
  async createThread(threadCreateParams?: ThreadCreateParams): Promise<Thread> {
    try {
      return await this.openai.beta.threads.create(threadCreateParams);
    } catch (error) {
      throw new HttpException(
        {
          message: 'Error creating thread',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
        { cause: error },
      );
    }
  }
}

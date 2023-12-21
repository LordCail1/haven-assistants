import { CreateThreadException } from '../../exceptions/threads/create-thread.exception';
import { Injectable } from '@nestjs/common';
import {
  ThreadCreateParams,
  Thread,
} from 'openai/resources/beta/threads/threads';
import OpenAI from 'openai';

/**
 * This service is responsible for interacting with the OpenAI threads API
 * https://platform.openai.com/docs/api-reference/threads
 */
@Injectable()
export class OpenaiThreadsService {
  constructor(private openai: OpenAI) {}

  /**
   * Creates a new thread
   * https://platform.openai.com/docs/api-reference/threads/createThread
   * @param threadCreateParams A thread
   */
  async createThread(threadCreateParams?: ThreadCreateParams): Promise<Thread> {
    try {
      return await this.openai.beta.threads.create(threadCreateParams);
    } catch (error) {
      throw new CreateThreadException(error);
    }
  }
}

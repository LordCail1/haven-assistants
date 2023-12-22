import { CreateThreadException } from '../../exceptions/threads/create-thread.exception';
import { Injectable } from '@nestjs/common';
import {
  ThreadCreateParams,
  Thread,
  ThreadDeleted,
} from 'openai/resources/beta/threads/threads';
import OpenAI from 'openai';
import { DeleteThreadException } from '../../exceptions/threads/delete-thread.exception';

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

  /**
   * Deletes a thread
   * https://platform.openai.com/docs/api-reference/threads/deleteThread
   * @param threadId
   * @returns
   */
  async deleteThread(threadId: string): Promise<ThreadDeleted> {
    try {
      return await this.openai.beta.threads.del(threadId);
    } catch (error) {
      throw new DeleteThreadException();
    }
  }
}

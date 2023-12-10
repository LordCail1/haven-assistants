import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import { openai_key } from 'src/shared/constants';
import OpenAI from 'openai';
import {
  Thread,
  ThreadCreateParams,
} from 'openai/resources/beta/threads/threads';

@Injectable()
export class OpenaiThreadsService {
  private openai: OpenAI = new OpenAI({
    apiKey: this.configService.get<string>(openai_key),
  });

  constructor(private readonly configService: ConfigService) {}

  /**
   * Creates a new thread
   * @param threadCreateParams - Optional array of thread messages
   */
  async createThread(threadCreateParams?: ThreadCreateParams): Promise<Thread> {
    return this.openai.beta.threads.create(threadCreateParams);
  }
}

import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import { openai_key } from 'src/shared/constants';
import { Thread } from '../types/types';
import OpenAI from 'openai';

@Injectable()
export class OpenaiThreadsService {
  private openai: OpenAI = new OpenAI({
    apiKey: this.configService.get<string>(openai_key),
  });

  constructor(private readonly configService: ConfigService) {}

  async createThread(): Promise<Thread> {
    return this.openai.beta.threads.create();
  }
}

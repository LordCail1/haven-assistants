import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { OpenaiService } from '../openai.service';
import { Thread } from '../../types/types';

@Injectable()
export class OpenaiThreadsService {
  constructor(
    @Inject(forwardRef(() => OpenaiService))
    private readonly openaiService: OpenaiService,
  ) {}

  async createThread(): Promise<Thread> {
    return this.openaiService.getOpenaiInstance().beta.threads.create();
  }

  async runThread(threadId: string, assistantId: string) {
    return this.openaiService
      .getOpenaiInstance()
      .beta.threads.runs.create(threadId, {
        assistant_id: assistantId,
      });
  }
}

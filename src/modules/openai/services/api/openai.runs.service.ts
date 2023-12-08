import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { OpenaiService } from '../openai.service';

@Injectable()
export class OpenaiRunsService {
  constructor(
    @Inject(forwardRef(() => OpenaiService))
    private readonly openaiService: OpenaiService,
  ) {}

  async runThread(threadId: string, assistantId: string) {
    return this.openaiService
      .getOpenaiInstance()
      .beta.threads.runs.create(threadId, {
        assistant_id: assistantId,
      });
  }
}

import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import { openai_key } from 'src/shared/constants';
import OpenAI from 'openai';
import { Run } from 'openai/resources/beta/threads/runs/runs';

@Injectable()
export class OpenaiRunsService {
  private openai: OpenAI = new OpenAI({
    apiKey: this.configService.get<string>(openai_key),
  });

  constructor(private readonly configService: ConfigService) {}

  async runThread(threadId: string, assistantId: string): Promise<Run> {
    return this.openai.beta.threads.runs.create(threadId, {
      assistant_id: assistantId,
    });
  }

  async retrieveRun(threadId: string, runId: string): Promise<Run> {
    let run = await this.openai.beta.threads.runs.retrieve(threadId, runId);
    while (
      run.status === 'cancelling' ||
      run.status === 'in_progress' ||
      run.status === 'queued'
    ) {
      const newPromise = new Promise((resolve) => setTimeout(resolve, 1000));
      await newPromise;
      run = await this.openai.beta.threads.runs.retrieve(threadId, runId);
    }
    switch (run.status) {
      case 'cancelled': {
        throw new Error('The run was cancelled');
      }
      case 'failed': {
        throw new Error('The run failed');
      }
      case 'requires_action': {
        throw new Error('The run requires action');
      }
      case 'expired': {
        throw new Error('The run expired');
      }
      case 'completed': {
        return run;
      }
      default: {
        throw new Error('Something went wrong');
      }
    }
  }
}

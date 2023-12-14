import {
  Injectable,
  HttpException,
  HttpStatus,
  RequestTimeoutException,
} from '@nestjs/common';
import { OpenaiAbstractService } from '../openai.abstract.service';
import { Run } from 'openai/resources/beta/threads/runs/runs';
import { CreateRunException } from '../../exceptions/runs/create-run.exception';
import { RetrieveRunException } from '../../exceptions/runs/retrive-run.exception';

/**
 * This service is responsible for interacting with the OpenAI runs API
 * https://platform.openai.com/docs/api-reference/runs
 */
@Injectable()
export class OpenaiRunsService extends OpenaiAbstractService {
  /**
   * Creates a run for a specific thread
   * @param threadId The thread id associated with the run
   * @param assistantId The assistant id associated with the run
   * @returns The run object
   */
  async createRun(threadId: string, assistantId: string): Promise<Run> {
    try {
      return await this.openai.beta.threads.runs.create(threadId, {
        assistant_id: assistantId,
      });
    } catch (error) {
      throw new CreateRunException(threadId, assistantId, error);
    }
  }

  /**
   * This method is responsible for polling the run until it is completed
   * @param threadId The thread id associated with the run
   * @param runId The id of the run
   * @returns The run object once retrieved
   */
  async retrieveRun(threadId: string, runId: string): Promise<Run> {
    try {
      let run = await this.openai.beta.threads.runs.retrieve(threadId, runId);
      const startTime: number = Date.now();
      const timeout: number = 30000;
      while (
        run.status === 'cancelling' ||
        run.status === 'in_progress' ||
        run.status === 'queued'
      ) {
        if (Date.now() - startTime > timeout) {
          console.log('time was no good!');
          throw new RequestTimeoutException(
            'OpenAI API took too long to respond',
          );
        }

        console.log('waiting for run to complete - ', run.status);
        await new Promise((resolve) => setTimeout(resolve, 1000));
        run = await this.openai.beta.threads.runs.retrieve(threadId, runId);
      }
      switch (run.status) {
        case 'cancelled': {
          throw new RetrieveRunException(
            'The run was cancelled',
            threadId,
            runId,
            run.last_error,
          );
        }
        case 'failed': {
          throw new RetrieveRunException(
            'The run failed',
            threadId,
            runId,
            run.last_error,
          );
        }
        case 'requires_action': {
          throw new RetrieveRunException(
            'The run requires action',
            threadId,
            runId,
            run.last_error,
          );
        }
        case 'expired': {
          throw new RetrieveRunException(
            'The run expired',
            threadId,
            runId,
            run.last_error,
          );
        }
        case 'completed': {
          return run;
        }
        default: {
          throw new RetrieveRunException(
            'Something went wrong',
            threadId,
            runId,
            run.last_error,
          );
        }
      }
    } catch (error) {
      throw error;
    }
  }
}

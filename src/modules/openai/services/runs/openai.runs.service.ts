import {
  Injectable,
  HttpException,
  HttpStatus,
  RequestTimeoutException,
} from '@nestjs/common';
import { OpenaiAbstractService } from '../openai.abstract.service';
import { Run } from 'openai/resources/beta/threads/runs/runs';

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
      throw new HttpException(
        {
          message: 'The run could not be created',
          threadId,
          assistantId,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
        { cause: error },
      );
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
      const timeout: number = 1500;
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
        const newPromise = new Promise((resolve) => setTimeout(resolve, 1000));
        await newPromise;
        run = await this.openai.beta.threads.runs.retrieve(threadId, runId);
      }
      switch (run.status) {
        case 'cancelled': {
          throw new HttpException(
            {
              message: 'The run was cancelled',
              threadId,
              runId,
            },
            HttpStatus.INTERNAL_SERVER_ERROR,
            { cause: run.last_error },
          );
        }
        case 'failed': {
          throw new HttpException(
            {
              message: 'The run failed',
              threadId,
              runId,
            },
            HttpStatus.INTERNAL_SERVER_ERROR,
            { cause: run.last_error },
          );
        }
        case 'requires_action': {
          // throw new Error('The run requires action');
          throw new HttpException(
            {
              message: 'The run requires action',
              threadId,
              runId,
            },
            HttpStatus.INTERNAL_SERVER_ERROR,
            { cause: run.last_error },
          );
        }
        case 'expired': {
          throw new HttpException(
            {
              message: 'The run expired',
              threadId,
              runId,
            },
            HttpStatus.INTERNAL_SERVER_ERROR,
            { cause: run.last_error },
          );
        }
        case 'completed': {
          return run;
        }
        default: {
          throw new HttpException(
            {
              message: 'Something went wrong',
              threadId,
              runId,
            },
            HttpStatus.INTERNAL_SERVER_ERROR,
            { cause: run.last_error },
          );
        }
      }
    } catch (error) {
      throw error;
    }
  }
}

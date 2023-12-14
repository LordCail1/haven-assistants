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
   * creates a run for a specific thread
   * @param threadId - the thread id associated with the run
   * @param assistantId - the assistant id associated with the run
   * @returns the run object
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
          error,
          threadId,
          assistantId,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * this method is responsible for polling the run until it is completed
   * @param threadId - the thread id associated with the run
   * @param runId - the id of the run
   * @returns the run object
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
              error: run.last_error,
              threadId,
              runId,
            },
            HttpStatus.INTERNAL_SERVER_ERROR,
          );
        }
        case 'failed': {
          throw new HttpException(
            {
              message: 'The run failed',
              error: run.last_error,
              threadId,
              runId,
            },
            HttpStatus.INTERNAL_SERVER_ERROR,
          );
        }
        case 'requires_action': {
          // throw new Error('The run requires action');
          throw new HttpException(
            {
              message: 'The run requires action',
              error: run.last_error,
              threadId,
              runId,
            },
            HttpStatus.INTERNAL_SERVER_ERROR,
          );
        }
        case 'expired': {
          throw new HttpException(
            {
              message: 'The run expired',
              error: run.last_error,
              threadId,
              runId,
            },
            HttpStatus.INTERNAL_SERVER_ERROR,
          );
        }
        case 'completed': {
          return run;
        }
        default: {
          throw new HttpException(
            {
              message: 'Something went wrong',
              error: run.last_error,
              threadId,
              runId,
            },
            HttpStatus.INTERNAL_SERVER_ERROR,
          );
        }
      }
    } catch (error) {
      throw error;
    }
  }
}

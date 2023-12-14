import { HttpException, HttpStatus } from '@nestjs/common';

/**
 * this exception handles the case where a run could not successfully be returned
 */
export class RetrieveRunException extends HttpException {
  /**
   * @param message a message to describe the exception
   * @param threadId a Thread ID
   * @param runId a run ID
   * @param cause The cause of the exception
   */
  constructor(message: string, threadId: string, runId: string, cause?: any) {
    super(
      {
        message,
        threadId,
        runId,
      },
      HttpStatus.INTERNAL_SERVER_ERROR,
      { cause },
    );
  }
}

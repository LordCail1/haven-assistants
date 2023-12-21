import { HttpException, HttpStatus } from '@nestjs/common';

/**
 * this exception handles the case where a run could not successfully be returned
 */
export class RetrieveRunException extends HttpException {
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

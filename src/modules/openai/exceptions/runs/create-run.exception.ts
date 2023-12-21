import { HttpException, HttpStatus } from '@nestjs/common';

/**
 * this exception handles the case where a run could not successfully be created
 */
export class CreateRunException extends HttpException {
  constructor(threadId: string, assistantId: string, cause?: any) {
    super(
      {
        message: 'The run could not be created',
        threadId,
        assistantId,
      },
      HttpStatus.INTERNAL_SERVER_ERROR,
      { cause },
    );
  }
}

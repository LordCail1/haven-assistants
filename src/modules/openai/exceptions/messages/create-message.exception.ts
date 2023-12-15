import { HttpException, HttpStatus } from '@nestjs/common';

/**
 * This exception handles the case where creating a message has failed
 */
export class CreateMessageException extends HttpException {
  constructor(threadId: string, cause?: any) {
    super(
      { message: 'The message could not be created', threadId },
      HttpStatus.INTERNAL_SERVER_ERROR,
      { cause },
    );
  }
}

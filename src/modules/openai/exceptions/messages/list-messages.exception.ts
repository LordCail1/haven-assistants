import { HttpException, HttpStatus } from '@nestjs/common';

/**
 * This exception handles the case where listing messages has failed
 */
export class ListMessagesException extends HttpException {
  constructor(threadId: string, cause?: any) {
    super(
      {
        message: 'The messages could not be listed',
        threadId,
      },
      HttpStatus.INTERNAL_SERVER_ERROR,
      { cause },
    );
  }
}

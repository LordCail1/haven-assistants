import { HttpException, HttpStatus } from '@nestjs/common';

/**
 * This exception handles the case where listing all the assistants has failed
 */
export class ListAllAssistantsException extends HttpException {
  constructor(cause?: any) {
    super(
      'The assistants could not be listed',
      HttpStatus.INTERNAL_SERVER_ERROR,
      { cause },
    );
  }
}

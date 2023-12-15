import { HttpException, HttpStatus } from '@nestjs/common';

/**
 * This exception handles the case where generating the first question has failed
 */
export class GenerateFirstQuestionException extends HttpException {
  constructor(cause?: any) {
    super(
      'Something went wrong generating the first question',
      HttpStatus.INTERNAL_SERVER_ERROR,
      { cause },
    );
  }
}

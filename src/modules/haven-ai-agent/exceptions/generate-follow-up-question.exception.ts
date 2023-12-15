import { HttpException, HttpStatus } from '@nestjs/common';

/**
 * This exception handles the case where generating the follow up question has failed
 */
export class GenerateFollowUpQuestionException extends HttpException {
  constructor(cause?: any) {
    super(
      'Something went wrong generating the follow up question',
      HttpStatus.INTERNAL_SERVER_ERROR,
      { cause },
    );
  }
}

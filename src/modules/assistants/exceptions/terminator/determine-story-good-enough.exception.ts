import { HttpException, HttpStatus } from '@nestjs/common';

/**
 * This exception handles the case where determining if the story is good enough has failed
 */
export class DetermineStoryGoodEnoughException extends HttpException {
  constructor(cause?: any) {
    super(
      'There was a problem determining if the story was good or not',
      HttpStatus.INTERNAL_SERVER_ERROR,
      { cause },
    );
  }
}

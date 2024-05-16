import { HttpException, HttpStatus } from '@nestjs/common';

/**
 * This exception is thrown when something goes wrong creating the summary.
 */
export class SimplifyLanguageException extends HttpException {
  constructor(cause?: any) {
    super(
      'Something went wrong creating the summary',
      HttpStatus.INTERNAL_SERVER_ERROR,
      { cause },
    );
  }
}

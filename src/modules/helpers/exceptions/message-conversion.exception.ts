import { HttpException, HttpStatus } from '@nestjs/common';

/**
 * This exception handles the case where converting the thread messages to the correct format has failed
 */
export class MessageConversionException extends HttpException {
  constructor(cause?: any) {
    super(
      'something went wrong converting the thread messages to the correct format',
      HttpStatus.INTERNAL_SERVER_ERROR,
      { cause },
    );
  }
}

import { HttpException, HttpStatus } from '@nestjs/common';

/**
 * This exception handles the case where parsing the last response from the AI has failed
 */
export class ParseLastResponseForJsonException extends HttpException {
  constructor(cause?: any) {
    super(
      'something went wrong parsinng the json!',
      HttpStatus.INTERNAL_SERVER_ERROR,
      { cause },
    );
  }
}

import { HttpException, HttpStatus } from '@nestjs/common';

/**
 * This exception handles the case where the AI tries to send back an image instead of a regular message
 * containing text.
 */
export class ImageNotTextException extends HttpException {
  constructor() {
    super(
      'The AI tried sending an image back instead of text!',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}

import { HttpException, HttpStatus } from '@nestjs/common';

/**
 * This exception handles the case where creating an assistant has failed
 */
export class CreateAssistantException extends HttpException {
  constructor(cause?: any) {
    super(
      `The assistant could not be created`,
      HttpStatus.INTERNAL_SERVER_ERROR,
      { cause },
    );
  }
}

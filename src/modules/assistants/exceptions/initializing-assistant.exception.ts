import { HttpException, HttpStatus } from '@nestjs/common';

/**
 * This exception handles the case where the assistant could not be properly initialized
 */
export class InitializingAssistantException extends HttpException {
  constructor(assistantName: string, cause?: any) {
    super(
      `There was a problem initializing the ${assistantName} assistant`,
      HttpStatus.INTERNAL_SERVER_ERROR,
      { cause },
    );
  }
}

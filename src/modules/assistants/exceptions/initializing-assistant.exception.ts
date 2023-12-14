import { HttpException, HttpStatus } from '@nestjs/common';

/**
 * This exception handles the case where the assistant could not be properly initialized
 */
export class InitializingAssistantException extends HttpException {
  /**
   * @param assistantName The name of the assistant that could not be initialized
   * @param cause The cause of the exception
   */
  constructor(assistantName: string, cause?: any) {
    super(
      `There was a problem initializing the ${assistantName} assistant`,
      HttpStatus.INTERNAL_SERVER_ERROR,
      { cause },
    );
  }
}

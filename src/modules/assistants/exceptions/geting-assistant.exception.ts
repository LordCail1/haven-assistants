import { HttpException, HttpStatus } from '@nestjs/common';

/**
 * This exception handles the case where we could not retrieve the assistant due to it being undefined
 */
export class GettingAssistantException extends HttpException {
  /**
   * @param assistantName The name of the assistant that could not be initialized
   * @param cause The cause of the exception
   */
  constructor(assistantName: string, cause?: any) {
    super(
      `There was a problem getting the ${assistantName} assistant. ${assistantName} is not defined`,
      HttpStatus.FAILED_DEPENDENCY,
      { cause },
    );
  }
}

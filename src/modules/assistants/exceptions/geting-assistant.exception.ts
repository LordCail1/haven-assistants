import { HttpException, HttpStatus } from '@nestjs/common';

/**
 * This exception handles the case where we could not retrieve the assistant due to it being undefined
 */
export class GettingAssistantException extends HttpException {
  constructor(assistantName: string, cause?: any) {
    super(
      `There was a problem getting the ${assistantName} assistant. ${assistantName} is not defined`,
      HttpStatus.FAILED_DEPENDENCY,
      { cause },
    );
  }
}

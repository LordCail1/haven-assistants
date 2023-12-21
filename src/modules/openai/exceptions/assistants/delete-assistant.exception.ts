import { HttpException, HttpStatus } from '@nestjs/common';

/**
 * This exception handles the case where deleting an assistant has failed
 */
export class DeleteAssistantException extends HttpException {
  constructor(assistantId: string, cause?: any) {
    super(
      `The assistant with id ${assistantId} could not be deleted`,
      HttpStatus.INTERNAL_SERVER_ERROR,
      {
        cause,
      },
    );
  }
}

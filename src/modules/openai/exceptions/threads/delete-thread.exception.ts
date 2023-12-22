import { HttpException, HttpStatus } from '@nestjs/common';

/**
 * This exception handles the case where a thread could not successfully be deleted
 */
export class DeleteThreadException extends HttpException {
  constructor(cause?: any) {
    super('Error deleting thread', HttpStatus.INTERNAL_SERVER_ERROR, { cause });
  }
}

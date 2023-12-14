import { HttpException, HttpStatus } from '@nestjs/common';

/**
 * This exception handles the case where a thread could not successfully be created
 */
export class CreateThreadException extends HttpException {
  /**
   * @param cause The cause of the exception
   */
  constructor(cause?: any) {
    super('Error creating thread', HttpStatus.INTERNAL_SERVER_ERROR, { cause });
  }
}

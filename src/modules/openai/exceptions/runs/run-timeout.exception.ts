import { HttpException, HttpStatus } from '@nestjs/common';

/**
 * This exception handles the case where the run took too long to be completed by OpenAI.
 * The client can't realistically wait for more than 30 seconds.
 */
export class RunTimeoutException extends HttpException {
  constructor() {
    super('OpenAI API took too long to respond', HttpStatus.REQUEST_TIMEOUT);
  }
}

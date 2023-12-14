import { HttpException, HttpStatus } from '@nestjs/common';

export class CreatingThreadException extends HttpException {
  constructor(cause?: any) {
    super('Error creating thread', HttpStatus.INTERNAL_SERVER_ERROR, { cause });
  }
}

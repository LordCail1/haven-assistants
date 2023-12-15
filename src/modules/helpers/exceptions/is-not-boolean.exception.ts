import { HttpException, HttpStatus } from '@nestjs/common';

/**
 * Exception that is thrown when a property that is expected to be a boolean is not.
 * This typically occurs when parsing a response where a boolean value is expected.
 */
export class IsNotBooleanException extends HttpException {
  constructor(variableName: string) {
    super(`${variableName} is not a boolean`, HttpStatus.INTERNAL_SERVER_ERROR);
  }
}

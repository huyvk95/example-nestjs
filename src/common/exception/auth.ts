import { HttpException, HttpStatus } from '@nestjs/common';

export class AuthException extends HttpException {
  constructor(message?: string) {
    super(
      message || 'User must sign in to access this method',
      HttpStatus.UNAUTHORIZED,
    );
  }
}

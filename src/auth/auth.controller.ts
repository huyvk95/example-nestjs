import { Controller, Get, Param } from '@nestjs/common';

import { AuthService } from './auth.service';

@Controller({
  path: 'auth',
  version: '1',
})
export class AuthController {
  constructor(private authService: AuthService) {}

  @Get(':email')
  findAll(@Param('email') email: string) {
    // return 'Hello auth controller';
    return this.authService.isExisted(email);
  }
}

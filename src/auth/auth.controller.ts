import { Body, Controller, Get, Param, Post, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';

import { UserSignInDto, UserSignUpDto } from './auth.dto';
import { AuthService } from './auth.service';

@ApiTags('auth')
@ApiBearerAuth()
@Controller({
  path: 'auth',
  version: '1',
})
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signin')
  async signIn(@Body() body: UserSignInDto) {
    const { email, password } = body;
    const response = await this.authService.login(email, password);
    return response;
  }

  @Post('token')
  async token(@Req() req: Request) {
    const response = await this.authService.loginToken(req);
    return response;
  }

  @Post('signup')
  async signup(@Body() body: UserSignUpDto) {
    const response = await this.authService.create(body);
    return response;
  }

  @Post('signout')
  async signout(@Req() req: Request) {
    await this.authService.logout(req);
    return { message: 'Success' };
  }

  @Get('isExisted')
  isExisted(@Param('email') email: string) {
    return this.authService.isExisted(email);
  }
}

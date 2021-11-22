import { Body, Controller, Headers, Post } from '@nestjs/common';

import { UserSignInDto, UserSignUpDto } from './auth.dto';
import { AuthService } from './auth.service';

@Controller({
  path: 'auth',
  version: '1',
})
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signin')
  signIn(@Body() body: UserSignInDto) {
    // eslint-disable-next-line
    console.log(body);
    return 'This action sign in user with email password';
  }

  @Post('token')
  token(@Headers('token') token: string) {
    // eslint-disable-next-line
    console.log(token);
    return 'This action sign in user with token';
  }

  @Post('signup')
  signup(@Body() body: UserSignUpDto) {
    // eslint-disable-next-line
    console.log(body);
    return 'This action adds a new user';
  }

  @Post('signout')
  signout(@Headers('token') token: string) {
    // eslint-disable-next-line
    console.log(token);
    return 'This action sign out user';
  }
}

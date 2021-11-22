import { IsEmail, IsNotEmpty } from 'class-validator';

export class UserSignInDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;
}

export class UserSignUpDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;

  name?: string;
}

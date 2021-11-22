export class UserSignInDto {
  email: string;

  password: string;
}

export class UserSignUpDto {
  email: string;

  password: string;

  name?: string;
}

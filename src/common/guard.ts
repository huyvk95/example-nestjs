import { Request } from 'express';
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { User, UserModel } from '@database/user.schema';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(@InjectModel(User.name) private userModel: UserModel) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req: Request = context.switchToHttp().getRequest();

    const token = req.get('authorization');
    if (!token) throw new UnauthorizedException('AccessToken is required');

    const user = await this.userModel.checkToken(token);

    req.user = user;
    return true;
  }
}

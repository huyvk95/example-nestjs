import { Request } from 'express';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { AuthException, InternalException } from '@common/exception';

import { User, UserModel, UserType } from '../database/user.schema';

@Injectable()
export class AuthService {
  constructor(@InjectModel(User.name) private userModel: UserModel) {}

  async create(data: UserType): Promise<{ user: UserType; token: string }> {
    if (await this.userModel.isExisted(data.email))
      throw new InternalException('Email already existed');
    const userDoc = new this.userModel(data);
    const user = await userDoc.save();

    const token = await this.userModel.setToken(user);

    return { user: user.toObject({ useProjection: true }), token };
  }

  async login(
    email: string,
    password: string,
  ): Promise<{ user: UserType; token: string }> {
    const user = await this.userModel.authentication(email, password);
    const token = await this.userModel.setToken(user);

    return { user: user.toObject({ useProjection: true }), token };
  }

  async loginToken(req: Request) {
    const { authorization } = req.headers;
    if (!authorization) throw new AuthException();
    const user = await this.userModel.checkToken(authorization);
    return user.toObject({ useProjection: true });
  }

  async logout(req: Request) {
    const { authorization } = req.headers;
    if (!authorization) throw new AuthException();
    const user = await this.userModel.checkToken(authorization);
    await this.userModel.removeToken(user);
  }

  async isExisted(email: string): Promise<boolean> {
    return this.userModel.isExisted(email);
  }
}

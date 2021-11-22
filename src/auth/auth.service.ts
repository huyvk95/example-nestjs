import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { User, UserModel, UserType } from '../database/user.schema';

@Injectable()
export class AuthService {
  constructor(@InjectModel(User.name) private userModel: UserModel) {}

  async create(data: UserType): Promise<User> {
    const user = new this.userModel(data);
    return user.save();
  }

  async isExisted(email: string): Promise<boolean> {
    return this.userModel.isExisted(email);
  }
}

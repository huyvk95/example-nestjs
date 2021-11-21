import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { User, UserModel } from '../database/user.schema';

@Injectable()
export class AuthService {
  constructor(@InjectModel(User.name) private userModel: UserModel) {}

  async create(createUser: any): Promise<User> {
    const user = new this.userModel(createUser);
    return user.save();
  }

  async isExisted(email: string): Promise<boolean> {
    return this.userModel.isExisted(email);
  }
}

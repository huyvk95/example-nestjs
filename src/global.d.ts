import { Document } from 'mongoose';

import { User } from './database/user.schema';

declare global {
  type UserDocument = User & Document<any, any, User>;
}

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Model } from 'mongoose';
import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';

import { AuthException } from '@common/exception';
import { QueryOneType } from '@common/type';

// > Type
export type UserType = {
  email: string;
  password: string;
  name?: string;
  token?: string;
};

// > Schema
@Schema()
export class User extends Document implements UserType {
  @Prop({
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: [8, 'Email must have more than 8 characters'],
    validate: [
      {
        validator: (email: string) =>
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
            email,
          ),
        message: 'Invalid email address!',
      },
    ],
  })
  email: string;

  @Prop({
    type: String,
    required: true,
    trim: true,
    minlength: [8, 'Password must have more than 8 characters'],
    select: false,
  })
  password: string;

  @Prop({
    type: String,
    trim: true,
  })
  name: string;

  @Prop({
    type: String,
    select: false,
  })
  token?: string;
}

export const UserSchema = SchemaFactory.createForClass(User);

// > Document
export type UserDocument = User & Document & { _id: any };

// > Model
export type UserModel = Model<UserDocument> & {
  isExisted: (email: string) => Promise<boolean>;
  findByEmail: (email: string) => QueryOneType<UserDocument>;
  checkToken: (token: string) => Promise<UserDocument>;
  setToken: (document: UserDocument) => Promise<string>;
  removeToken: (document: UserDocument) => Promise<string>;
  authentication: (email: string, password: string) => Promise<UserDocument>;
};

// > Static
UserSchema.post('validate', async function (document: User, next) {
  const doc = document;
  if (this.isModified('password'))
    doc.password = await bcrypt.hash(doc.password, 12);
  return next();
});

UserSchema.statics.isExisted = async function (email) {
  const users = await this.find({ email });
  return users.length !== 0;
};

UserSchema.statics.findByEmail = function (email) {
  return this.findOne({ email });
};

UserSchema.statics.authentication = async function (
  email: string,
  password: string,
) {
  const user = await this.findOne({ email });
  if (!user) throw new AuthException();

  const userPassword = (await this.findOne({ email }).select('password'))?.get(
    'password',
  );
  if (!userPassword) throw new AuthException();
  if (!(await bcrypt.compare(password, userPassword)))
    throw new AuthException('Password incorrect');

  return user;
};

UserSchema.statics.checkToken = async function (token: string) {
  const data: UserType = jwt.verify(token, process.env.SECRET_KEY);
  if (!data || !data.email) throw new AuthException();
  const user = await this.findOne({ email: data.email, token });
  if (!user) throw new AuthException();
  return user;
};

UserSchema.statics.setToken = async function (document: UserDocument) {
  // * Get data
  const data = document.toObject({ useProjection: true });
  // * Hash
  const token = jwt.sign(data, process.env.SECRET_KEY as string, {
    expiresIn: '1d',
  });
  // * Set new token
  document.set('token', token);
  await document.save();

  return token;
};

UserSchema.statics.removeToken = async function (document: UserDocument) {
  document.set('token', undefined);
  await document.save();
};

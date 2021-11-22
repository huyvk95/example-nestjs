import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Model } from 'mongoose';
import * as bcrypt from 'bcrypt';

// > Type
export type UserType = {
  email: string;
  password: string;
  name?: string;
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
}

export const UserSchema = SchemaFactory.createForClass(User);

// > Document
export type UserDocument = User & Document & { _id: any };

// > Model
export type UserModel = Model<UserDocument> & {
  isExisted: (email: string) => Promise<boolean>;
  findByEmail: (email: string) => UserDocument;
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

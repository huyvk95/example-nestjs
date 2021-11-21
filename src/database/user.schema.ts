import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Model } from 'mongoose';
import bcrypt from 'bcrypt';

// > Static
interface UserMethod {
  isExisted: (email: string) => Promise<boolean>;
  findByEmail: (email: string) => UserDocument;
}

// > Class
@Schema()
export class User extends Document implements UserMethod {
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

  isExisted: (email: string) => Promise<boolean>;

  findByEmail: (email: string) => UserDocument;
}

// > Document
export type UserDocument = User & Document & { _id: any };

// > Model
export type UserModel = Model<UserDocument> & UserMethod;

// > Schema
export const UserSchema = SchemaFactory.createForClass(User);

// > Static
UserSchema.post('validate', function (document: User, next) {
  const doc = document;
  if (this.isModified('password'))
    doc.password = bcrypt.hashSync(doc.password, 12);
  return next();
});

UserSchema.pre('save', async function (next) {
  try {
    if (this.isNew && (await this.isExisted(this.email)))
      throw new Error('Email already existed');
    next();
  } catch (error) {
    next(error);
  }
});

UserSchema.static('isExisted', async function (email) {
  const users = await this.find({ email });
  return users.length !== 0;
});

UserSchema.static('findByEmail', function (email) {
  return this.findOne({ email, active: true });
});

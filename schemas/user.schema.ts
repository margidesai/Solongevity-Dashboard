import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ collection: 'tbl_user' })
export class User {
  @Prop()
  firstName: string;

  @Prop()
  lastName: string;

  @Prop()
  email: string;

  @Prop()
  password: string;

  @Prop()
  userType: string;

  @Prop()
  country: string;

  @Prop()
  isActive: boolean;

  @Prop()
  passwordToken: string;

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;
}
export const UserSchema = SchemaFactory.createForClass(User);

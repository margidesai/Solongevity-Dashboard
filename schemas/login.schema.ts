import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type LoginDocument = Login & Document;

@Schema({ collection: 'tbl_login' ,timestamps: true})
export class Login {
  @Prop()
  email: string;

  @Prop()
  password: string;

  @Prop()
  accessToken: string;

  @Prop()
  userType: string;

  @Prop()
  resetToken: string;

  @Prop()
  resetExp: Date;

  @Prop()
  emailVerificationCode: string;

  @Prop()
  emailVerificationExp: string;

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;
}
export const LoginSchema = SchemaFactory.createForClass(Login);

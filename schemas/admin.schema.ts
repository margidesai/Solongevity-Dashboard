import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, ObjectId } from 'mongoose';

export type AdminDocument = Admin & Document;

@Schema({ collection: 'tbl_admin',timestamps: true })
export class Admin {
  @Prop()
  firstName: string;

  @Prop()
  lastName: string;

  @Prop()
  loginId: string;

  @Prop()
  country: string;

  @Prop()
  isActive: boolean;

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;
}
export const AdminSchema = SchemaFactory.createForClass(Admin);



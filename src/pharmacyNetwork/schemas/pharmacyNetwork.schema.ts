import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, ObjectId } from 'mongoose';
import mongoose from 'mongoose';

export type PharmacyNetworkDocument = PharmacyNetwork & Document;

@Schema({ collection: 'tbl_pharmacyNetwork',timestamps: true })
export class PharmacyNetwork {
  @Prop()
  name: string;

  @Prop()
  personName: string;

  @Prop()
  loginId:mongoose.Schema.Types.ObjectId;

  @Prop()
  address: string;

  @Prop()
  town: string;

  @Prop()
  postalCode: string;

  @Prop()
  country: string;

  @Prop()
  phoneNumber: string;

  @Prop()
  personOfReference: string;

  @Prop()
  vat: string;

  @Prop()
  galaxy: string;

  @Prop({ type: Array })
  productPlan: string;

  @Prop()
  total: number;

  @Prop()
  finalAmount: number;

  @Prop()
  contractFile:string

  @Prop()
  paymentMode: string;

  @Prop()
  hqClient: string;

  @Prop()
  agentClient: string;

  @Prop({default:true})
  isActive: boolean;

  @Prop({default:false})
  isDeleted: boolean;

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;
}
export const PharmacyNetworkSchema = SchemaFactory.createForClass(PharmacyNetwork);



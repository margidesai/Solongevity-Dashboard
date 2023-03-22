import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, ObjectId } from 'mongoose';

export type PharmacyNetworkDocument = PharmacyNetwork & Document;

@Schema({ collection: 'tbl_pharmacyNetwork',timestamps: true })
export class PharmacyNetwork {
  @Prop()
  name: string;

  @Prop()
  personName: string;

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
  productPlanId: string;

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;
}
export const PharmacyNetworkSchema = SchemaFactory.createForClass(PharmacyNetwork);



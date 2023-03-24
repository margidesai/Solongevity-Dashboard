import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, ObjectId } from 'mongoose';

export type ProductPlanDocument = ProductPlan & Document;

@Schema({ collection: 'tbl_productPlan',timestamps: true })
export class ProductPlan {
  @Prop()
  name: string;

  @Prop()
  productType: string;

  @Prop()
  productFee: string;

  @Prop()
  pharmacy: number;

  @Prop()
  frequency: string;

  @Prop()
  discount: string;

  @Prop()
  freePlan: string;

  @Prop()
  isShown: Boolean;

  @Prop({default:true})
  isActive: Boolean;

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;
}
export const ProductPlanSchema = SchemaFactory.createForClass(ProductPlan);



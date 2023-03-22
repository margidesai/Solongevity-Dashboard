import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Login, LoginSchema } from 'schemas/login.schema';
import { EmailHelper } from 'src/common/email.helper';
import { PharmacyNetworkController } from './pharmacyNetwork.controller';
import { PharmacyNetworkService } from './pharmacyNetwork.service';
import { PharmacyNetwork, PharmacyNetworkSchema } from './schemas/pharmacyNetwork.schema';
import { ProductPlan, ProductPlanSchema } from './schemas/productPlan.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ProductPlan.name, schema: ProductPlanSchema },
      { name: PharmacyNetwork.name, schema: PharmacyNetworkSchema },
      { name: Login.name, schema: LoginSchema },
    ]),
  ],
  providers: [PharmacyNetworkService,EmailHelper],
  controllers: [PharmacyNetworkController],
  exports: [PharmacyNetworkService],
})
export class PharmacyNetworkModule {}
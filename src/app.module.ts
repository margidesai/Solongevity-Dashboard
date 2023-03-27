import { Module } from '@nestjs/common';
import { ConfigModule,ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { AdminController } from './admin/admin.controller';
import { AdminModule } from './admin/admin.module';

import 'dotenv/config';
import { AdminPasswordModule } from './admin-password/admin-password.module';
import { PharmacyNetworkController } from './pharmacyNetwork/pharmacyNetwork.controller';
import { PharmacyNetworkModule } from './pharmacyNetwork/pharmacyNetwork.module';
import { CredentialModule } from './common/credential/credential.module';
@Module({
  imports: [
    MongooseModule.forRootAsync({
      useFactory: async () => ({
        uri: process.env.DB_URL,
        useNewUrlParser: true,
      }),
      inject: [],
    }),
    AuthModule,
    AdminModule,
    AdminPasswordModule,
    PharmacyNetworkModule,
    CredentialModule
  ],
  controllers: [AdminController, PharmacyNetworkController],
  providers: [],
})
export class AppModule {}

import { Module } from '@nestjs/common';
import { ConfigModule,ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { AdminLoginController } from './admin/admin.controller';
import { AdminModule } from './admin/admin.module';

import 'dotenv/config';
import { AdminPasswordModule } from './admin-password/admin-password.module';
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
    AdminPasswordModule
  ],
  controllers: [AdminLoginController],
  providers: [],
})
export class AppModule {}

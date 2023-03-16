import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';

import 'dotenv/config';
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
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

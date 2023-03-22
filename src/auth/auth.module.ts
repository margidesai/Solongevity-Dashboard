import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';

import { JwtStrategy } from './jwt.strategy';
import { Module } from '@nestjs/common';
import { AdminModule } from 'src/admin/admin.module';
import { MongooseModule } from '@nestjs/mongoose';
import { LoginSchema } from 'schemas/login.schema';

@Module({
  imports:[
    AdminModule,
    MongooseModule.forFeature([{name:'Login',schema:LoginSchema}]),
  ],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController],
})
export class AuthModule {}

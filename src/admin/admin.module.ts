import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { UserSchema } from 'schemas/user.schema';
import { AdminPasswordModule } from 'src/admin-password/admin-password.module';
import { AdminService } from './admin.service';

@Module({
  imports:[
    MongooseModule.forFeature([{name:'User',schema:UserSchema}]),
    AdminPasswordModule
  ],
  providers: [AdminService],
  controllers: [],
  exports: [AdminService],
})
export class AdminModule {}

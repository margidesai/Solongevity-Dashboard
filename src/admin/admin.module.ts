import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Admin, AdminSchema } from 'schemas/admin.schema';
import { Login, LoginSchema } from 'schemas/login.schema';
import { EmailHelper } from 'src/common/email.helper';
import { AdminLoginController } from './admin.controller';
import { AdminService } from './admin.service';

@Module({
  imports:[
    MongooseModule.forFeature([{name:Login.name,schema:LoginSchema},{name:Admin.name,schema:AdminSchema}]),
  ],
  providers: [AdminService,EmailHelper],
  controllers: [AdminLoginController],
  exports: [AdminService],
})
export class AdminModule {}

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Admin, AdminSchema } from 'schemas/admin.schema';
import { Login, LoginSchema } from 'schemas/login.schema';
import { EmailHelper } from 'src/common/email.helper';
import { AdminPasswordController } from './admin-password.controller';
import { AdminPasswordService } from './admin-password.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Login.name, schema: LoginSchema },
      { name: Admin.name , schema: AdminSchema }
    ])
    
  ],
  controllers: [AdminPasswordController],
  providers: [AdminPasswordService,EmailHelper],
})
export class AdminPasswordModule {}

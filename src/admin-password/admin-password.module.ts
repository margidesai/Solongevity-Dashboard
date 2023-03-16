import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User } from 'schemas/user.schema';
import { EmailHelper } from 'src/common/email.helper';
import { AdminPasswordController } from './admin-password.controller';
import { AdminPasswordService } from './admin-password.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: User.name, schema: User }])],
  controllers: [AdminPasswordController],
  providers: [AdminPasswordService,EmailHelper],
})
export class AdminPasswordModule {}

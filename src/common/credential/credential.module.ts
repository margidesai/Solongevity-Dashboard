import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Login, LoginSchema } from 'schemas/login.schema';
import { EmailHelper } from '../email.helper';
import { CredentialController } from './credential.controller';
import { CredentialService } from './credential.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Login.name, schema: LoginSchema },
    ]),
  ],
  providers: [CredentialService,EmailHelper],
  controllers: [CredentialController],
  exports: [CredentialService],
})
export class CredentialModule {}

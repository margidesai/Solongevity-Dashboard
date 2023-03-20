import { Module,NestModule,MiddlewareConsumer } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { UserSchema } from 'schemas/user.schema';
import { AdminPasswordModule } from 'src/admin-password/admin-password.module';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { SuperAdminAuthMiddleware } from 'src/middleware/auth.middleware';
import { EmailHelper } from 'src/common/email.helper';

@Module({
  imports:[
    MongooseModule.forFeature([{name:'User',schema:UserSchema}]),
    AdminPasswordModule
  ],
  providers: [AdminService,EmailHelper],
  controllers: [AdminController],
  exports: [AdminService],
})
export class AdminModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {

    consumer
      .apply(SuperAdminAuthMiddleware)
      .forRoutes(AdminController);
  } 
}

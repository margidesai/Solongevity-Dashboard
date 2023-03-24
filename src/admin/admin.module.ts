import { Module, NestModule,MiddlewareConsumer } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Admin, AdminSchema } from 'schemas/admin.schema';
import { Login, LoginSchema } from 'schemas/login.schema';
import { EmailHelper } from 'src/common/email.helper';
import { SuperAdminAuthMiddleware } from 'src/middleware/auth.middleware';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';

@Module({
  imports:[
    MongooseModule.forFeature([{name:Login.name,schema:LoginSchema},{name:Admin.name,schema:AdminSchema}]),
  ],
  providers: [AdminService,EmailHelper],
  controllers: [AdminController],
  exports: [AdminService],
})
export class AdminModule {}

// implements NestModule {
//   configure(consumer: MiddlewareConsumer) {

//     consumer
//       .apply(SuperAdminAuthMiddleware)
//       .forRoutes(AdminController);
//   } 
// }

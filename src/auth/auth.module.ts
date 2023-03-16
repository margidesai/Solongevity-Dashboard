import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
// import { AdminService } from 'src/admin/admin.service';
import { AdminModule } from 'src/admin/admin.module'; 
import { JwtStrategy } from './jwt.strategy';
import { Module } from '@nestjs/common';

@Module({
  imports: [AdminModule],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController],
})
export class AuthModule {}

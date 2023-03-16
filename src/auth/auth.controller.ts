import { Body, Controller, Get, Post } from '@nestjs/common';
import { AdminService } from 'src/admin/admin.service'; 
import { AuthService } from './auth.service';
import { LoginDto } from 'src/admin/dto/login.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@Controller('auth')
@ApiTags('Login')
export class AuthController {
  constructor(
    private adminService: AdminService,
    private authService: AuthService,
  ) {}

  @Post('login')
  async login(@Body() loginDTO: LoginDto) {
    const admin = await this.adminService.userLogin(loginDTO);
    const payload = {
      _id: admin._id,
      email: admin.email,
    };
    const token = await this.authService.signPayload(payload);
    return { admin, token };
  }

}

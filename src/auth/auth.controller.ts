import { Body, Controller, Get, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { LoginDto } from 'src/admin/dto/login.dto';

@Controller('auth')
@ApiTags('Login')
export class AuthController {
  constructor(
    private authService: AuthService,
  ) {}

  @Post('/login')
    async login(@Body() params: LoginDto): Promise<any> {
        return await this.authService.login(params);
    }

  // @Post('login')
  // async login(@Body() loginDTO: LoginDto) {
  //   const admin = await this.adminService.login(loginDTO);
  //   const payload = {
  //     _id: admin._id,
  //     email: admin.email,
  //   };
  //   const token = await this.authService.signPayload(payload);
  //   return { admin, token };
  // }

}

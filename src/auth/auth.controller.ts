import { Body, Controller, Get, Post,Query } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto,ForgotPasswordDto } from './dto/login.dto';
import { ApiTags } from '@nestjs/swagger';
import {Query as ExpressQuery} from 'express-serve-static-core'

@Controller('auth')
@ApiTags('Admin Login')
export class AuthController {
  constructor(private authService: AuthService) {}


  @Post('/login')
  login(@Body() loginDto: LoginDto): Promise<{ token: string }> {
    return this.authService.login(loginDto);
  }

  @Get("/remeberme")
  async Remeberme(@Query() query:ExpressQuery) {
    return await this.authService.remeberMe(query);
  }

  @Post("/forgotPassword")
  async ForgotPassword(@Body() forgotpasswordDto: ForgotPasswordDto) {
    return await this.authService.forgotPassword(
      forgotpasswordDto,
    );
  }
}

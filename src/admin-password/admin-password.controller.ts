import {
  Body,
  Controller,
  Post,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AdminPasswordService } from './admin-password.service';
import { adminForgotPasswordDto } from './dto/adminForgotPassword.dto';
import { adminResetPasswordDto } from './dto/adminResetPassword.dto';

@Controller('adminPassword')
@ApiTags('Password')
export class AdminPasswordController {
  constructor(private readonly adminPasswordService: AdminPasswordService) {}

  
  @Post('forgotPassword')
  async ForgotPassword(@Body() AdminForgotPasswordDto: adminForgotPasswordDto) {
    console.log("hete");
    return await this.adminPasswordService.forgotPassword(
      AdminForgotPasswordDto,
    );
  }

  @Post('resetPassword')
  async PasswordReset(@Body() AdminResetPasswordDto: adminResetPasswordDto) {
    return await this.adminPasswordService.resetPassword(AdminResetPasswordDto);
  }

  
}

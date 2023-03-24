import { Body, Controller, Get, Post, Request } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JwtDecode } from 'src/util/AuthUtil';
import {
  changePasswordDto,
  editProfileDto,
  verficationCodeSendDto,
} from './dto/editProfile.dto';
import { AdminService } from './admin.service';

@ApiBearerAuth()
@ApiTags('admin Profile')
@Controller('admin-login')
export class AdminController {
  constructor(private adminService: AdminService) {}

  @Get('getAdminProfile')
  async getAdminDetails(@Request() req: Request) {
    console.log("req.header is controller file",req.headers);
    const admin = await this.adminService.getAdminDetails(
      req.headers['authorization'],
    );
    console.log('admin is:::::::::::::::::::', admin);
    return admin;
  }

  @Post('changePasswordCodeSend')
  async changePasswordCodeSend(
    @Body() verificationCodeDto: verficationCodeSendDto,
    @Request() req: Request,
  ) {
    const decoded = JwtDecode.getDecodedJwt(req.headers['authorization']);
    const admin = await this.adminService.changePasswordCodeSend(
      verificationCodeDto,

      req.headers['authorization'],
    );
    return admin;
  }

  @Post('changePassword')
  async changePassword( @Body() changePasswordDto:changePasswordDto,@Request() req: Request){
    const decoded = JwtDecode.getDecodedJwt(req.headers['authorization']);
    const adminPassword = await this.adminService.changePassword(changePasswordDto,req.headers['authorization'])
    return adminPassword;
  }

  @Post('editProfile')
  async editProfile( @Body() editProfileDto:editProfileDto,@Request() req: Request){
    const editProfile = await this.adminService.editProfile(editProfileDto,req.headers['authorization'])
    return editProfile;
  }

}

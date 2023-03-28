import { adminForgotPasswordDto } from './dto/adminForgotPassword.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { User, UserDocument } from 'schemas/user.schema';
import { adminResetPasswordDto } from './dto/adminResetPassword.dto';
import { EmailHelper } from 'src/common/email.helper';
import * as bcrypt from 'bcrypt';
import { Login, LoginDocument } from 'schemas/login.schema';
import { Admin, AdminDocument } from 'schemas/admin.schema';
import { AuthExceptions } from 'src/common/helper/exception/auth.exception';

@Injectable()
export class AdminPasswordService {
  constructor(
    @InjectModel(Login.name) private readonly loginModel: Model<LoginDocument>,
    @InjectModel(Admin.name) private adminModel: Model<AdminDocument>,
    private readonly mailer: EmailHelper,
  ) {}

  async forgotPassword(AdminForgotPasswordDto: adminForgotPasswordDto) {
    const token = Math.floor(Math.random() * 1000000 + 1);
    console.log('token is::::::::::::::::::::::::::', token);
    const admin = await this.loginModel.findOne({
      email: AdminForgotPasswordDto.email,
    });
    console.log("admin is:::::::::::::::",admin);
    if (!admin) {
      Logger.error('User does not exists.' + admin);
      throw AuthExceptions.AccountNotexist();
    } else {
      try {
        const mailBody = `<tr>
                          <td style="padding:0 35px;">
                            <h1 style="color:#1e1e2d; font-weight:500; margin:0;font-size:32px;font-family:'Rubik',sans-serif;">Reset your password</h1>
                            <h3>Email: ${AdminForgotPasswordDto.email}</h3>  
                            <h6 style="color:#1e1e2d; font-weight:350; margin:0;font-size:28px;font-family:'Rubik',sans-serif;">Your Verification code is: ${token}</h6>
                          </td>
                        </tr>`;

        const getUser = await this.adminModel.findOne({ loginId: admin._id });
        console.log('get user is::::::::::::::::::', getUser);
        if (getUser) {
          await this.mailer.sendMailToAdmin(
            {
              adminName: getUser.firstName + getUser.lastName,
              email: admin.email,
              token,
              html: mailBody,
            },
            'Forgot Password',
          );

          await this.loginModel.findOneAndUpdate(
            { email: AdminForgotPasswordDto.email },
            { resetToken: token },
          );
          Logger.log('Verification code sent your mail id.');
          return { email: AdminForgotPasswordDto.email };
        } else {
          throw AuthExceptions.AccountNotexist();
        }
      } catch (e) {
        Logger.error('Oops! Something went wrong.' + e);
        throw new NotFoundException('Oops! Something went wrong.');
      }
    }
  }

  async resetPassword(AdminResetPasswordDto: adminResetPasswordDto) {
    const Admin = await this.loginModel.findOne({
      resetToken: AdminResetPasswordDto.token,
    });

    if (!Admin) {
      Logger.error('No token found.');
      throw new NotFoundException('No token found.');
    }

    try {
      const saltOrRounds = 10;
      const password = AdminResetPasswordDto.new_password;
      const passwordHash = await bcrypt.hash(password, saltOrRounds);
      await this.loginModel.findByIdAndUpdate(
        { _id: Admin._id },
        { password: passwordHash, resetToken: '' },
      );
      Logger.log('Password Reset successfully.');
     return {
      email:Admin.email
     }
    } catch (e) {
      Logger.error('Oops! Something went wrong.' + e);
      throw new NotFoundException('Oops! Something went wrong.');
    }
  }
}

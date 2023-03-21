import { adminForgotPasswordDto } from './dto/adminForgotPassword.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { User, UserDocument } from 'schemas/user.schema';
import { adminResetPasswordDto } from './dto/adminResetPassword.dto';
import { EmailHelper } from 'src/common/email.helper';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AdminPasswordService {
  constructor(
    @InjectModel(User.name) private readonly adminModel: Model<UserDocument>,
    private readonly mailer: EmailHelper,
  ) {}

  async forgotPassword(AdminForgotPasswordDto: adminForgotPasswordDto) {
    const token = Math.floor(Math.random() * 1000000 + 1);
    console.log('token is::::::::::::::::::::::::::', token);
    const admin = await this.adminModel.findOne({
      email: AdminForgotPasswordDto.email,
    });
    if (!admin) {
      Logger.error('User does not exists.' + admin);
      throw new NotFoundException('User does not exists');
    } else {
      try {
        const mailBody = `<tr>
                          <td style="padding:0 35px;">
                            <h1 style="color:#1e1e2d; font-weight:500; margin:0;font-size:32px;font-family:'Rubik',sans-serif;">Reset your password</h1>
                            <h3>Email: ${AdminForgotPasswordDto.email}</h3>  
                            <h6 style="color:#1e1e2d; font-weight:350; margin:0;font-size:28px;font-family:'Rubik',sans-serif;">Your Verification code is: ${token}</h6>
                          </td>
                        </tr>`;

        await this.mailer.sendMailToAdmin(
          {
            adminName: admin.firstName + admin.lastName,
            email: admin.email,
            token,
            html: mailBody,
          },
          'Forgot Password',
        );

        await this.adminModel.findOneAndUpdate(
          { email: AdminForgotPasswordDto.email },
          { passwordToken: token },
        );
        Logger.log('Verification code sent your mail id.');
        return {
          status: 200,
          message: 'Verification code sent your mail id.',
        };
      } catch (e) {
        Logger.error('Oops! Something went wrong.' + e);
        throw new NotFoundException('Oops! Something went wrong.');
      }
    }
  }

  async resetPassword(AdminResetPasswordDto: adminResetPasswordDto) {
    const Admin = await this.adminModel.findOne({
      passwordToken: AdminResetPasswordDto.token,
    });

    if (!Admin) {
      Logger.error('No token found.');
      throw new NotFoundException('No token found.');
    }

    try {
      const saltOrRounds = 10;
      const password = AdminResetPasswordDto.new_password;
      const passwordHash = await bcrypt.hash(password, saltOrRounds);
      await this.adminModel.findByIdAndUpdate(
        { _id: Admin._id },
        { password: passwordHash, passwordToken: '' },
      );
      Logger.log('Password Reset successfully.');
      return {
        status: 200,
        message: 'Password Reset successfully.',
      };
    } catch (e) {
      Logger.error('Oops! Something went wrong.' + e);
      throw new NotFoundException('Oops! Something went wrong.');
    }
  }
}

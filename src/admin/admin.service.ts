import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserDocument } from 'schemas/user.schema';
import { Payload } from 'src/payload';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import {
  changePasswordDto,
  verficationCodeSendDto,
} from './dto/editProfile.dto';
import { EmailHelper } from 'src/common/email.helper';

@Injectable()
export class AdminService {
  constructor(
    @InjectModel('User') private userModel: Model<UserDocument>,
    private readonly mailer: EmailHelper,
  ) {}
  async findByPayload(payload: Payload) {
    const { email } = payload;
    return await this.userModel.findOne({ email });
  }

  async userLogin(loginDto: LoginDto) {
    const { email, password, userType } = loginDto;

    const user = await this.userModel.findOne({ email, userType });
    if (!user) {
      throw new NotFoundException('User does not exists');
    }
    if (await bcrypt.compare(password, user.password)) {
      return user;
    } else {
      throw new BadRequestException('invalid credential');
    }
  }

  // async remeberMe() {
  //   const admin = await this.adminModel.find({});
  //   if (!admin) {
  //     throw new NotFoundException('Admin does not exists');
  //   } else {
  //     return admin;
  //   }
  // }

  async getAdminDetails(authHeaders: string) {
    console.log('auth headers service is:::::::::::::::::', authHeaders);
    let admin = await this.userModel.find({});
    if (!admin) {
      throw new NotFoundException('Admin does not exists');
    } else {
      return admin[0];
    }
  }

  async changePasswordCodeSend(
    verificationCodeDto: verficationCodeSendDto,
    authHeaders: string,
  ) {
    //console.log("verification code is:::::::::::::::::",verificationCodeDto);
    let admin = await this.userModel.find({});
    console.log('admin is:::::::::::::::', admin);
    const token = Math.floor(Math.random() * 1000000 + 1);

    if (
      await bcrypt.compare(verificationCodeDto.oldPassword, admin[0].password)
    ) {
      try {
        const mailBody = `<tr>
                          <td style="padding:0 35px;">
                            <h1 style="color:#1e1e2d; font-weight:500; margin:0;font-size:32px;font-family:'Rubik',sans-serif;">Change password verification code</h1>
                            <h3>Email: ${admin[0].email}</h3>  
                            <h6 style="color:#1e1e2d; font-weight:350; margin:0;font-size:28px;font-family:'Rubik',sans-serif;">Your Verification code is: ${token}</h6>
                          </td>
                        </tr>`;

        await this.mailer.sendMailToAdmin(
          {
            adminName: admin[0].firstName + admin[0].lastName,
            email: admin[0].email,
            token,
            html: mailBody,
          },
          'Forgot Password',
        );

        await this.userModel.findOneAndUpdate(
          { email: admin[0].email },
          { passwordToken: token },
        );
        return 'Verification code sent your mail id.';
      } catch (e) {
        throw new NotFoundException('Oops! Something went wrong.');
      }
    } else {
      throw new BadRequestException('Password not match.');
    }
  }

  async changePassword(
    changePasswordDto: changePasswordDto,
    authHeaders: string,
  ) {
    let admin = await this.userModel.find({});
    console.log(
      'change password token is::::::::::::::::::::::::::::::::',
      changePasswordDto.token,
    );
    let checkToken = await this.userModel.findOne({
      passwordToken: changePasswordDto.token,
    });
    console.log('check token is:::::', checkToken);
    if (checkToken) {
      try {
        const saltOrRounds = 10;
        const password = changePasswordDto.new_password;
        const passwordHash = await bcrypt.hash(password, saltOrRounds);
        await this.userModel.findByIdAndUpdate(
          { _id: checkToken._id },
          { password: passwordHash, passwordToken: '' },
        );

        return 'Password change successfully.';
      } catch (e) {
        throw new NotFoundException('Oops! Something went wrong.');
      }
    } else {
      throw new NotFoundException('No token found.');
    }
  }
}

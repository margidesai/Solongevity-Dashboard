import {
  BadRequestException,
  Injectable,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { LoginDocument } from 'schemas/login.schema';
import { AuthExceptions } from 'src/common/helper/exception/auth.exception';
import { Payload } from 'src/payload';
import * as bcrypt from 'bcrypt';
import { CustomError } from 'src/common/helper/exception';
import { AdminDocument } from 'schemas/admin.schema';
import { verficationCodeSendDto,changePasswordDto,editProfileDto } from './dto/editProfile.dto';
import { EmailHelper } from 'src/common/email.helper';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AdminService {
  constructor(
    @InjectModel('Login') private loginModel: Model<LoginDocument>,
    @InjectModel('Admin') private adminModel: Model<AdminDocument>,
    private readonly mailer: EmailHelper,
  ) {}

  async findByPayload(payload: Payload) {
    const { email } = payload;
    return await this.loginModel.findOne({ email });
  }

  async login(loginDto: LoginDto) {
    try {
      const user = await this.loginModel.findOne({
        email: loginDto.email,
        userType: loginDto.userType,
      });
     
      if (!user) {
        throw AuthExceptions.AccountNotexist();
      }
      if (!bcrypt.compareSync(loginDto.password, user.password)) {
        throw AuthExceptions.InvalidIdPassword();
      }
      // console.log("user is:::::::::::::::::::::::::",user);

      await this.loginModel.updateOne(
        { _id: user._id },
        { accessToken: user.accessToken },
      );
      return {
        email: user.email,
        accessToken: user.accessToken,
      };
    } catch (error) {
      if (error?.response?.error) {
        throw error;
      } else {
        throw CustomError.UnknownError(error?.message);
      }
    }
  }

  async getAdminDetails(authHeaders: string) {
    
    const admin = await this.loginModel.find({userType:"superadmin"});
    console.log("admin:::::::::::::::::::::::",admin);
    if (!admin) {
      throw AuthExceptions.AccountNotexist();
    } else {
      let getAdminDetails = await this.adminModel.findOne({
        loginId: admin[0]._id,
      });
      return {
        email: admin[0].email,
        firstName: getAdminDetails.firstName,
        lastName: getAdminDetails.lastName,
        country: getAdminDetails.country,
      };
    }
  }

  async changePasswordCodeSend(
    verificationCodeDto: verficationCodeSendDto,
    authHeaders: string,
  ) {
    //console.log("verification code is:::::::::::::::::",verificationCodeDto);
    let admin = await this.loginModel.find({});
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

        const getUser = await this.adminModel.findOne({
          loginId: admin[0]._id,
        });
        console.log('get user is::::::::::::::::::', getUser);
        if (getUser) {
          await this.mailer.sendMailToAdmin(
            {
              adminName: getUser.firstName + getUser.lastName,
              email: admin[0].email,
              token,
              html: mailBody,
            },
            'Forgot Password',
          );

          await this.loginModel.findOneAndUpdate(
            { email: admin[0].email },
            { resetToken: token },
          );
          return { email: admin[0].email };
        } else {
          throw AuthExceptions.AccountNotexist();
        }
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
    let checkToken = await this.loginModel.findOne({
      resetToken: changePasswordDto.token,
    });
    if (checkToken) {
      try {
        const saltOrRounds = 10;
        const password = changePasswordDto.new_password;
        const passwordHash = await bcrypt.hash(password, saltOrRounds);
        await this.loginModel.findByIdAndUpdate(
          { _id: checkToken._id },
          { password: passwordHash, resetToken: '' },
        );
        return {
          message: 'Password change successfully.',
        };
      } catch (e) {
        throw new NotFoundException('Oops! Something went wrong.');
      }
    } else {
      throw new NotFoundException('No token found.');
    }
  }

  async editProfile(editProfileDto: editProfileDto, authHeaders: string) {
    let admin = await this.loginModel.find({});
    console.log("edit admin is::::::::::::::::::::",admin);
    if (!admin) {
      throw AuthExceptions.AccountNotexist();
    } else {
      let updateAdmin = await this.adminModel.findOneAndUpdate({
        firstName: editProfileDto.firstName,
        lastName: editProfileDto.lastName,
        country: editProfileDto.country,
      });
      if (updateAdmin) {
        return {
          message:'Update admin details successfully.'
        };
      } else {
        throw new NotFoundException('Oops! Something went wrong.');
      }
    }
  }
}

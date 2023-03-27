import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Login, LoginDocument } from 'schemas/login.schema';
import { credentialDto } from './dto/credential.dto';
import { Model } from 'mongoose';
import { AuthExceptions, CustomError } from '../helper/exception';
import * as bcrypt from 'bcrypt';
import { EmailHelper } from '../email.helper';

@Injectable()
export class CredentialService {
  constructor(
    @InjectModel(Login.name)
    private loginmodel: Model<LoginDocument>,
    private readonly mailer: EmailHelper,
  ) {}

  async changeCredential(body: credentialDto): Promise<any> {
    try {
      const getLoginData = await this.loginmodel.findOne({ _id: body.loginId });
      if (!getLoginData) {
        throw AuthExceptions.AccountNotexist();
      } else {
        const saltOrRounds = 10;
        const password = body.newPassword;
        const passwordHash = await bcrypt.hash(password, saltOrRounds);
        if (password != body.reEnterNewPassword) {
          throw new BadRequestException('Password not match.');
        } else {
          const mailBody = `<tr>
                          <td style="padding:0 35px;">
                            <h1 style="color:#1e1e2d; font-weight:500; margin:0;font-size:32px;font-family:'Rubik',sans-serif;">Change Credential</h1>
                            <h6 style="color:#1e1e2d; font-weight:350; margin:0;font-size:28px;font-family:'Rubik',sans-serif;">Your Password is: ${password}</h6>
                          </td>
                        </tr>`;

          await this.loginmodel.findOneAndUpdate(
            { _id: body.loginId },
            { password: passwordHash },
          );

          await this.mailer.sendMailToAdmin(
            {
              email: getLoginData.email,
              html: mailBody,
            },
            'Change Credential',
          );
          return {
            message:"Email will be sent with new credentials detail"
          }
        }
      }
    } catch (error) {
      if (error?.response?.error) {
        throw error;
      } else {
        throw CustomError.UnknownError(error?.message);
      }
    }
  }
}

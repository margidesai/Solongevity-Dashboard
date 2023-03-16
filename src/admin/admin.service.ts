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
import { adminForgotPasswordDto } from './dto/adminForgotPassword.dto';
@Injectable()
export class AdminService {
  constructor(@InjectModel('User') private userModel: Model<UserDocument>) {}
  async findByPayload(payload: Payload) {
    const { email } = payload;
    return await this.userModel.findOne({ email });
  }

  async userLogin(loginDto: LoginDto) {
    const { email, password,userType } = loginDto;
    
    const user = await this.userModel.findOne({ email,userType });
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

  
}

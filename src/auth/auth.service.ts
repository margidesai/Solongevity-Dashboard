import { Injectable, UnauthorizedException,NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schemas/user.schema';
import {Query } from 'express-serve-static-core'
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
//import { Helper } from 'util/helper.service'; 
import { LoginDto,ForgotPasswordDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>,
    private jwtService: JwtService,
   // private helper: Helper,
  ) {}

  public async login(loginDto: LoginDto): Promise<{ token: string }> {
    const { email, password } = loginDto;

    const user = await this.userModel.findOne({ email });
    console.log("user is:::::::::::::::::::",user);
    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const isPasswordMatched = await bcrypt.compare(password, user.password);

    if (!isPasswordMatched) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const token = this.jwtService.sign({ id: user._id });

    return { token };
  }

  public async remeberMe(query:Query): Promise<any> {
    // const token = this.helper.generateRandomString(32);
     
     const admin = await this.userModel.find({});
    console.log("admin is:::::::::::::::",admin);
     if (!admin) {
       throw new NotFoundException('admin not found')
     }else{
      return admin[0]
     }
 
   }

  public async forgotPassword(forgotpasswordDto: ForgotPasswordDto): Promise<any> {
   // const token = this.helper.generateRandomString(32);
    
    const admin = await this.userModel.findOne({
      email: forgotpasswordDto.email,
    });

    if (!admin) {
      throw new NotFoundException('admin not found')
    }

    console.log("admin is::::::::::::::::::::::",admin);
  }
}

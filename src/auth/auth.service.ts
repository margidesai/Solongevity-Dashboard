import { Injectable } from '@nestjs/common';
import { Payload } from 'src/payload';
import { sign } from 'jsonwebtoken';
import { JwtConstants } from './auth.constants';
import { AdminService } from 'src/admin/admin.service'
import { JwtPayload } from 'src/common/interfaces/jwt.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { LoginDocument } from 'schemas/login.schema';
import { LoginDto } from 'src/admin/dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel('Login') private loginModel: Model<LoginDocument>,
    private adminService: AdminService,
  ) {}

  async login(params: LoginDto): Promise<any> {
    let user: any = await this.adminService.login(params);
    const accessToken = this.signPayload(user);
    user.accessToken = accessToken;
    await this.loginModel.updateOne(
      { email: user.email },
      { accessToken: user.accessToken },
    );
    return user;
  }

  signPayload(user: any) {
    const payload: JwtPayload = {
      id: user._id,
      userId: user._id,
      email: user.email,
    };

    return sign(payload, JwtConstants.secret, {
      expiresIn: JwtConstants.expiresIn,
    });
  }
  async validateAdmin(payload: Payload) {
    return await this.adminService.findByPayload(payload);
  }
}

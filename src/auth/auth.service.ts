import { Injectable } from '@nestjs/common';
import { Payload } from 'src/payload';
import { sign } from 'jsonwebtoken';
import { AdminService } from 'src/admin/admin.service';
import { JwtConstants } from './auth.constants';

@Injectable()
export class AuthService {
  constructor(private adminService: AdminService) {}

  async signPayload(payload: Payload) {
    return sign(payload, JwtConstants.secret, {
      expiresIn: JwtConstants.expiresIn,
    });
  }
  async validateAdmin(payload: Payload) {
    return await this.adminService.findByPayload(payload);
  }
}

import { NestMiddleware, Injectable, NotFoundException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { JwtDecode } from 'src/util/AuthUtil';
// import { CommonService } from 'src/common/common.service';

@Injectable()
export class SuperAdminAuthMiddleware implements NestMiddleware {
  constructor() //   private readonly commonService: CommonService
  {}

  async use(req: Request, res: Response, next: NextFunction) {
    try {
      const decoded = JwtDecode.getDecodedJwt(req.headers.authorization);
      console.log('decoded::::::::::::::::', decoded);
      if (decoded) {
        console.log('if cond');
        next();
      } else {
        throw new NotFoundException('Unauthorized user');
      }
    } catch (error) {
      console.log('SuperAdminAuthMiddleware -> use -> error', error);
      console.log(
        'SuperAdminAuthMiddleware -> use -> error.response',
        error.response,
      );
      if (error.response.statusCode) {
        throw new NotFoundException(error.response.message);
      }
    }
  }
}

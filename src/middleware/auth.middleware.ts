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
      console.log("req headers is::::::::::::::::::::::::",req.headers.authorization);
      const decoded = JwtDecode.getDecodedJwt(req.headers.authorization);
      console.log('decoded::::::::::::::::', decoded);
      if (decoded) {
        next();
      } else {
        throw new NotFoundException('Unauthorized user');
      }
    } catch (error) {
      console.log('SuperAdminAuthMiddleware -> use -> error', error);
      if (error.response.statusCode) {
        throw new NotFoundException(error.response.message);
      }
    }
  }
}

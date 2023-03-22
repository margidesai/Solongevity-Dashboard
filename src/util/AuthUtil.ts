import { Request } from 'express';
import * as jwt from 'jsonwebtoken';
import { JwtConstants } from 'src/auth/auth.constants';
import {
    NotFoundException,
  } from '@nestjs/common';
export const JwtDecode = {

    getDecodedJwt(accessToken: String): any {
        console.log('auth utils headers is:::::::::::::::::::::::::::::::::',accessToken);
        try {
           
            if (accessToken && (accessToken as string).split(' ')[1]) {
                const token = (accessToken as string).split(' ')[1];
                const decoded: any = jwt.verify(token, JwtConstants.secret);
                return decoded;

            }
            else {
                throw new NotFoundException('This resource is forbidden from this user');
            }
        }
        catch(error){
            console.log("error is::::::::::::::::::::::::",error); 
        }
    }
}

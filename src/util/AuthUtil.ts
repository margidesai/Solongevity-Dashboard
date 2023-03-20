import { Request } from 'express';
import * as jwt from 'jsonwebtoken';
import { JwtConstants } from 'src/auth/auth.constants';
import {
    NotFoundException,
  } from '@nestjs/common';
export const JwtDecode = {

    getDecodedJwt(authHeaders: String): any {
        try {
           console.log('auth headers is:::::::::::::::::::::::::::::::::',authHeaders);
            if (authHeaders && (authHeaders as string).split(' ')[1]) {
                const token = (authHeaders as string).split(' ')[1];
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

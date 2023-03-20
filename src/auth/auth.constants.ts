import { SetMetadata } from '@nestjs/common';

export const JwtConstants = {
  secret: 'W3!!n3$$-C@r3',
  //secret: 'secretKey',
  expiresIn: '30d', // '24hr'
};

export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);

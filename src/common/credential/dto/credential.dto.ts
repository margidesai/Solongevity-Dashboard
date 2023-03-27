import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class credentialDto {
  @ApiProperty()
  @IsNotEmpty()
  loginId:string;

  @ApiProperty()
  @IsNotEmpty()
  newPassword:string;

  @ApiProperty()
  @IsNotEmpty()
  reEnterNewPassword: string;
}
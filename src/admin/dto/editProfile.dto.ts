import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, IsNotEmpty, IsEmail } from 'class-validator';
export class verficationCodeSendDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  oldPassword: string;
}

export class changePasswordDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  token: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  new_password: string;
}

export class editProfileDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly firstName: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly lastName: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsEmail({}, { message: 'Please enter correct email' })
  readonly email: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  readonly country:string
}

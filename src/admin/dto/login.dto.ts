import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Optional } from '@nestjs/common';
export class LoginDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsEmail({}, { message: 'Please enter correct email' })
  readonly email: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  readonly password: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  readonly userType:string
}


import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, MaxLength } from 'class-validator';

export class adminForgotPasswordDto {
  @ApiProperty()
  @IsNotEmpty()
  @MaxLength(255)
  email: string;
}

import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class adminResetPasswordDto {
  @ApiProperty()
  @IsNotEmpty()
  public readonly token: string;

  @ApiProperty()
  @IsNotEmpty()
  public readonly new_password: string;
}

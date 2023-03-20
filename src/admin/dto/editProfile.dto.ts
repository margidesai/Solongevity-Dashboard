import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsString, IsNotEmpty, Validate } from "class-validator";
export class verficationCodeSendDto{
      @ApiProperty()
      @IsString()
      @IsNotEmpty()
      oldPassword: string;
  
  }


  export class changePasswordDto{
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    token: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    new_password:string;

}
  
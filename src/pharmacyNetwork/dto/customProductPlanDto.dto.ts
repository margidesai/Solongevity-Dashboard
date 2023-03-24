import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, IsNotEmpty, IsEmail, IsArray, IsBoolean, IsOptional } from 'class-validator';
export class customProductPlanDto {
      @ApiProperty()
      @IsString()
      @IsNotEmpty()
      name:string;
      
      @ApiProperty()
      @IsString()
      @IsNotEmpty()
      productType:string;

      @ApiProperty()
      @IsString()
      @IsNotEmpty()
      productFee:string;

      @ApiProperty()
      @IsNumber()
      @IsNotEmpty()
      pharmacy:number;

      @ApiProperty()
      @IsString()
      @IsNotEmpty()
      frequency:string;

      @ApiProperty()
      @IsString()
      @IsNotEmpty()
      discount:string;

      @ApiProperty()
      @IsString()
      @IsNotEmpty()
      freePlan:string;
}
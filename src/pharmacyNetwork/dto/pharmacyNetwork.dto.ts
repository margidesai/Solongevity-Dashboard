import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, IsNotEmpty, IsEmail, IsArray } from 'class-validator';
export class pharmacyNetworkDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  userType: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  personName: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  address: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  town: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  postalCode: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  country: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsEmail({}, { message: 'Please enter correct email' })
  email: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  phoneNumber: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  personOfReference: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  vat: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  galaxy: string;

  @ApiProperty()
  @IsArray()
  @IsNotEmpty()
  productPlanId:String

}
import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, IsNotEmpty, IsEmail, IsArray, IsBoolean, IsOptional } from 'class-validator';
import mongoose from 'mongoose';
export class updatePharmacyNetworkDto {
 //_id: mongoose.Schema.Types.ObjectId;

  @ApiProperty()
  @IsNotEmpty()
  pharmacyNetworkId:string;

  @ApiProperty()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  personName: string;

  @ApiProperty()
  @IsNotEmpty()
  address: string;

  @ApiProperty()
  @IsNotEmpty()
  town: string;

  @ApiProperty()
  @IsNotEmpty()
  postalCode: string;

  @ApiProperty()
  @IsNotEmpty()
  country: string;

//   @ApiProperty()
//   @IsNotEmpty()
//   @IsEmail({}, { message: 'Please enter correct email' })
//   email: string;

  @ApiProperty()
  @IsNotEmpty()
  phoneNumber: string;

  @ApiProperty()
  @IsNotEmpty()
  personOfReference: string;

  @ApiProperty()
  @IsNotEmpty()
  vat: string;

}
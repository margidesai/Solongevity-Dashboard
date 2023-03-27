import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, IsNotEmpty, IsEmail, IsArray, IsBoolean, IsOptional } from 'class-validator';
import mongoose from 'mongoose';
export class deletePharmacyNetworkDto {
 //_id: mongoose.Schema.Types.ObjectId;

  @ApiProperty()
  @IsNotEmpty()
  pharmacyNetworkId:[string];
}
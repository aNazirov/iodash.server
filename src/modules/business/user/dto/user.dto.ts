import { PartialType } from '@nestjs/mapped-types';
import {
  IsBooleanString,
  IsEmail,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsNumber()
  roleId: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  balance: number;

  @IsOptional()
  @IsString()
  activeBefore: string;

  @IsString()
  password: string;
}

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsOptional()
  @IsNumber()
  rate?: number;

  @IsOptional()
  @IsNumber()
  avatarId?: number;
}

export class FilterUserParams {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsBooleanString()
  active?: string;
}

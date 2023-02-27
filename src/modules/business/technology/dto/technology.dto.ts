import { PartialType } from '@nestjs/mapped-types';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateTechnologyDto {
  @IsString()
  title: string;

  @IsNumber()
  iconId: number;
}

export class UpdateTechnologyDto extends PartialType(CreateTechnologyDto) {}

export class FilterTechnologyParams {
  @IsOptional()
  @IsString()
  title?: string;
}

import { PartialType } from '@nestjs/mapped-types';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateTagDto {
  @IsString()
  title: string;

  @IsNumber()
  iconId: number;
}

export class UpdateTagDto extends PartialType(CreateTagDto) {}

export class FilterTagParams {
  @IsOptional()
  @IsString()
  title?: string;
}

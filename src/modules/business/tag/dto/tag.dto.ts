import { PartialType } from '@nestjs/mapped-types';
import { IsOptional, IsString } from 'class-validator';

export class CreateTagDto {
  @IsString()
  title: string;
}

export class UpdateTagDto extends PartialType(CreateTagDto) {}

export class FilterTagParams {
  @IsOptional()
  @IsString()
  title?: string;
}

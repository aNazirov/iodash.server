import { PartialType } from '@nestjs/mapped-types';
import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateLessonDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNumber()
  fileId: number;

  @IsOptional()
  @IsNumber({}, { each: true })
  categories?: number[];

  @IsOptional()
  @IsNumber({}, { each: true })
  tags?: number[];

  @IsOptional()
  @IsNumber()
  posterId?: number;

  @IsNumber()
  price: number;
}

export class UpdateLessonDto extends PartialType(CreateLessonDto) {}

export class FilterFullLessonParams {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsNumber()
  categoryId?: number;

  @IsOptional()
  @IsNumber()
  tagId?: number;

  @IsOptional()
  @IsBoolean()
  isFavourites?: boolean;

  @IsOptional()
  @IsBoolean()
  isNew?: boolean;

  @IsOptional()
  @IsBoolean()
  withFile?: boolean;
}

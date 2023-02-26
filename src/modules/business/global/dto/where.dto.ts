import { IsNumberString, IsOptional, IsString } from 'class-validator';

export class NewApplication {
  @IsString()
  name: string;

  @IsString()
  phone: string;
}

export class MeiliSearchDto {
  @IsString()
  index: string;

  @IsString()
  search: string;

  @IsOptional()
  @IsString({ each: true })
  filter: string[];

  @IsOptional()
  @IsNumberString()
  offset: string;

  @IsOptional()
  @IsNumberString()
  limit: string;
}

export class LessonParamsDto {
  categories: number[];
}

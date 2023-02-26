import { OmitType, PartialType } from '@nestjs/mapped-types';
import { IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';

export class CreateSubscriptionTypeDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNumber()
  @Min(0)
  price: number;

  @IsNumber()
  @Min(0)
  @Max(12)
  months: number;

  @IsNumber()
  @Min(0)
  downloadsPerDay: number;
}

export class UpdateSubscriptionTypeDto extends PartialType(
  CreateSubscriptionTypeDto,
) {}

export class FindAllSubscriptionsDto extends PartialType(
  OmitType(CreateSubscriptionTypeDto, [] as const),
) {}

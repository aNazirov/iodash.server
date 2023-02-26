import { OmitType, PartialType } from '@nestjs/mapped-types';
import { IsDate, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreatePaymentDto {
  @IsNumber()
  typeId: number;

  @IsOptional()
  @IsNumber()
  statusId?: number;

  @IsNumber()
  userId: number;

  @IsNumber()
  summa: number;

  @IsOptional()
  @IsString()
  phone_number?: string;

  @IsOptional()
  @IsString()
  click_trans_id?: string;

  @IsOptional()
  @IsString()
  merchant_trans_id?: string;

  @IsOptional()
  @IsString()
  click_paydoc_id?: string;

  @IsOptional()
  @IsString()
  merchant_prepare_id?: string;

  @IsOptional()
  @IsString()
  merchant_confirm_id?: string;

  @IsOptional()
  @IsString()
  payme_transaction_id?: string;
}

export class UpdatePaymentDto extends PartialType(CreatePaymentDto) {
  @IsOptional()
  @IsString()
  cancel_reason?: string;

  @IsOptional()
  @IsNumber()
  perfermAt?: number;
}

export class FilterPaymentParams extends PartialType(
  OmitType(CreatePaymentDto, ['summa'] as const),
) {}

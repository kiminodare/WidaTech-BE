import { Type } from 'class-transformer';
import {
  IsArray,
  IsDateString,
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

export enum PaymentType {
  CASH = 'CASH',
  CREDIT = 'CREDIT',
  NOTCASHORCREDIT = 'NOTCASHORCREDIT',
}

export class CreateInvoiceProductDto {
  @IsString()
  readonly item: string;

  @IsInt()
  readonly quantity: number;

  @IsNumber()
  readonly totalCogs: number;

  @IsNumber()
  readonly totalPrice: number;
}

export class CreateInvoiceDto {
  @IsInt()
  readonly invoiceNo: number;

  @IsDateString()
  readonly date: string;

  @IsString()
  readonly customer: string;

  @IsString()
  readonly salesperson: string;

  @IsEnum(PaymentType, {
    message:
      'paymentType must be one of: CASH, CREDIT_CARD, DEBIT_CARD, TRANSFER',
  })
  readonly paymentType: PaymentType;

  @IsOptional()
  @IsString()
  readonly notes?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateInvoiceProductDto)
  readonly products: CreateInvoiceProductDto[];
}

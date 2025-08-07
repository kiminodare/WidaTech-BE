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
  Validate,
} from 'class-validator';
import { QuantityExceedsStock } from '@/features/invoices/validators/quantity-exceeds-stock.validator';

export enum PaymentType {
  CASH = 'CASH',
  CREDIT = 'CREDIT',
  NOTCASHORCREDIT = 'NOTCASHORCREDIT',
}

export class CreateInvoiceProductDto {
  @IsInt()
  readonly productId: number;

  @IsString()
  readonly item: string;

  @IsInt()
  @Validate(QuantityExceedsStock)
  readonly quantity: number;

  @IsInt()
  readonly price: number;

  @IsNumber()
  readonly totalCogs: number;

  @IsOptional()
  @IsNumber()
  readonly totalPrice: number;
}

export class CreateInvoiceDto {
  @IsString()
  readonly invoiceNo: string;

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

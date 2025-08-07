import { Expose, Transform, Type } from 'class-transformer';
import { InvoiceProduct } from 'generated/prisma';

export class InvoiceItemDto {
  @Expose()
  @Transform(({ obj }) => (obj as InvoiceProduct).item)
  productName: string;

  @Expose()
  quantity: number;

  @Expose()
  @Transform(({ obj }) => (obj as InvoiceProduct).totalCogs)
  price: number;
}

export class InvoiceResponseDto {
  @Expose()
  id: number;

  @Expose()
  invoiceNo: number;

  @Expose()
  @Type(() => Date)
  date: Date;

  @Expose()
  customer: string;

  @Expose()
  salesperson: string;

  @Expose()
  paymentType: string;

  @Expose()
  notes: string;

  @Expose()
  totalAmount?: number;

  @Expose()
  @Type(() => InvoiceItemDto)
  products: InvoiceItemDto[];
}

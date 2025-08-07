import { Expose } from 'class-transformer';

export class RevenueDataPointDto {
  @Expose()
  period: string;

  @Expose()
  revenue: number;
}

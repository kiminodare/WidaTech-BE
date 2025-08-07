import { IsDateString, IsIn, IsOptional } from 'class-validator';

export class RevenueQueryDto {
  @IsIn(['day', 'week', 'month'])
  interval: 'day' | 'week' | 'month';

  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;
}

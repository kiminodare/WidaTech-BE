import { Module } from '@nestjs/common';
import { InvoicesService } from '@/features/invoices/invoices.service';
import { InvoicesController } from '@/features/invoices/invoices.controller';

@Module({
  controllers: [InvoicesController],
  providers: [InvoicesService],
})
export class InvoicesModule {}

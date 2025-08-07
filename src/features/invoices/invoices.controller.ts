import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { InvoicesService } from '@/features/invoices/invoices.service';
import { CreateInvoiceDto } from '@/features/invoices/dtos/create-invoice.dto';
import { GetProductSuggestionsDto } from '@/features/invoices/dtos/get-product-suggestions.dto';
import { RevenueQueryDto } from '@/features/invoices/dtos/get-revenue.dto';
import { GetInvoiceDto } from '@/features/invoices/dtos/get-invoice.dto';

@Controller('invoices')
export class InvoicesController {
  constructor(private readonly invoicesService: InvoicesService) {}

  @Get()
  async getInvoices(@Query() query: GetInvoiceDto) {
    return this.invoicesService.getInvoices(query);
  }

  @Get('revenue')
  getRevenueData(@Query() query: RevenueQueryDto) {
    return this.invoicesService.getRevenueData(query);
  }

  @Get('check/:id')
  async getInvoice(@Param('id') id: string) {
    return this.invoicesService.getInvoice(id);
  }

  @Post()
  async createInvoice(@Body() data: CreateInvoiceDto) {
    return this.invoicesService.createInvoice(data);
  }

  @Get('products/suggestions')
  getProductSuggestions(@Query() query: GetProductSuggestionsDto) {
    return this.invoicesService.getProductSuggestions(query.q);
  }
}

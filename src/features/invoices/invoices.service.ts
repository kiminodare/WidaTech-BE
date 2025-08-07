import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '@/shared/prisma/prisma.service';
import { CreateInvoiceDto } from '@/features/invoices/dtos/create-invoice.dto';
import { Product } from '@/features/invoices/interfaces/products.interface';
import { products as mockProducts } from '@/mock/products';
import { plainToInstance } from 'class-transformer';
import { InvoiceResponseDto } from '@/features/invoices/dtos/invoice-response.dto';
import { Invoice, Prisma } from 'generated/prisma';
import { RevenueQueryDto } from '@/features/invoices/dtos/get-revenue.dto';
import { RevenueDataPointDto } from '@/features/invoices/dtos/revenue-data-point.dto';
import { GetInvoiceDto } from '@/features/invoices/dtos/get-invoice.dto';
import { fromZonedTime } from 'date-fns-tz';

type GroupingInterval = 'day' | 'week' | 'month';
const TIMEZONE = 'Asia/Jakarta';

@Injectable()
export class InvoicesService {
  private readonly products: Product[] = mockProducts;

  constructor(private readonly prisma: PrismaService) {}

  async getInvoices(query: GetInvoiceDto) {
    const { page = 1, limit = 10, search, startDate, endDate } = query;
    const skip = (page - 1) * limit;

    const orConditions: Prisma.InvoiceWhereInput[] | undefined = search
      ? [
          { customer: { contains: search, mode: 'insensitive' } },
          { invoiceNo: { contains: search, mode: 'insensitive' } },
        ]
      : undefined;

    const whereClause: Prisma.InvoiceWhereInput = {
      ...(orConditions && { OR: orConditions }),
      ...(startDate || endDate
        ? {
            date: {
              ...(startDate && {
                gte: this.parseDateInTimezone(startDate, false),
              }),
              ...(endDate && {
                lte: this.parseDateInTimezone(endDate, true),
              }),
            },
          }
        : {}),
    };

    const [data, total] = await Promise.all([
      this.prisma.invoice.findMany({
        where: whereClause,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: { products: true },
      }),
      this.prisma.invoice.count({ where: whereClause }),
    ]);

    const transformed = data.map((invoice) => ({
      ...invoice,
      totalAmount: this.calculateTotalAmount(invoice),
    }));

    return {
      data: plainToInstance(InvoiceResponseDto, transformed, {
        excludeExtraneousValues: true,
      }),
      total,
      page,
      limit,
    };
  }

  async getInvoice(id: string) {
    const numericId = Number(id);
    const isNumeric = !Number.isNaN(numericId);

    return this.prisma.invoice.findFirst({
      where: {
        OR: [{ invoiceNo: id }, ...(isNumeric ? [{ id: numericId }] : [])],
      },
      include: { products: true },
    });
  }

  async createInvoice(dto: CreateInvoiceDto) {
    const { products, ...invoiceData } = dto;

    await this.prisma.invoice.create({
      data: {
        ...invoiceData,
        products: {
          create: products.map((p) => ({
            item: p.item,
            price: p.price,
            quantity: p.quantity,
            totalCogs: p.totalCogs,
            totalPrice: p.totalPrice ?? p.price * p.quantity,
          })),
        },
      },
    });

    return 'Invoice created successfully';
  }

  getProductSuggestions(query?: string): Product[] {
    return query?.trim()
      ? this.products.filter((p) =>
          p.name.toLowerCase().includes(query.toLowerCase()),
        )
      : this.products;
  }

  private calculateTotalAmount(
    invoice: Invoice & { products: { totalPrice: number }[] },
  ) {
    return invoice.products.reduce((total, p) => total + p.totalPrice, 0);
  }

  private readonly getPeriodKey = (
    date: Date,
    interval: GroupingInterval,
  ): string => {
    const d = new Date(date);
    const formatter = new Map<GroupingInterval, () => string>([
      ['day', () => d.toISOString().split('T')[0]],
      [
        'week',
        () => {
          const diff = d.getUTCDate() - d.getUTCDay();
          d.setUTCDate(diff);
          return d.toISOString().split('T')[0];
        },
      ],
      [
        'month',
        () => {
          d.setUTCDate(1);
          return d.toISOString().split('T')[0];
        },
      ],
    ]);

    return formatter.get(interval)?.() ?? d.toISOString().split('T')[0];
  };

  async getRevenueData(query: RevenueQueryDto): Promise<RevenueDataPointDto[]> {
    const { interval, startDate, endDate } = query;

    const start = this.parseDateInTimezone(startDate, false);
    const end = this.parseDateInTimezone(endDate, true);

    const where = {
      ...(start || end
        ? { date: { ...(start && { gte: start }), ...(end && { lte: end }) } }
        : {}),
    };

    const invoices = await this.prisma.invoice.findMany({
      where,
      include: {
        products: { select: { totalPrice: true } },
      },
      orderBy: { date: 'asc' },
    });

    const grouped: Record<string, number> = invoices.reduce(
      (acc, invoice) => {
        const key = this.getPeriodKey(invoice.date, interval);
        const amount = this.calculateTotalAmount(invoice);
        acc[key] = (acc[key] ?? 0) + amount;
        return acc;
      },
      {} as Record<string, number>,
    );

    const result = Object.entries(grouped)
      .map(([period, revenue]) => ({ period, revenue: +revenue.toFixed(2) }))
      .sort((a, b) => a.period.localeCompare(b.period));

    return plainToInstance(RevenueDataPointDto, result, {
      excludeExtraneousValues: true,
    });
  }

  private parseDateInTimezone(
    value?: string,
    endOfDay = false,
  ): Date | undefined {
    if (!value) return;

    const time = endOfDay ? 'T23:59:59.999' : 'T00:00:00.000';
    const dateTime = new Date(`${value}${time}`);

    if (Number.isNaN(dateTime.getTime())) {
      throw new BadRequestException(`Invalid date: ${value}`);
    }

    return fromZonedTime(dateTime, TIMEZONE);
  }
}

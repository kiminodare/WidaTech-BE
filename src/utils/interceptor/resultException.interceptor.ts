import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { Prisma } from 'generated/prisma';
import {
  formatValidationIssue,
  ValidationErrorResponse,
} from '@/utils/formatValidationIssue';

type JsonErrorResponse = {
  status: false;
  message: string;
  issue: unknown;
  result: null;
};

@Catch()
export class ResultExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();

    if (exception instanceof Prisma.PrismaClientKnownRequestError) {
      return this.handlePrismaException(res, exception);
    }

    if (exception instanceof HttpException) {
      const formatted = formatValidationIssue(exception.getResponse());
      if (formatted) {
        return this.handleValidationException(res, formatted);
      }
      return this.handleHttpException(res, exception);
    }

    return this.handleDefaultException(res, exception);
  }

  private handlePrismaException(
    res: Response,
    exception: Prisma.PrismaClientKnownRequestError,
  ) {
    const message = this.getPrismaErrorMessage(exception);
    const rawTarget = exception.meta?.target;
    const target = this.formatTarget(rawTarget);
    const issue = this.getPrismaIssue(exception, target, rawTarget);

    return this.jsonResponse(res, HttpStatus.BAD_REQUEST, message, issue);
  }

  // Message handling methods
  private getDuplicateEntryMessage(): string {
    return 'Duplicate Entry';
  }

  private getRecordNotFoundMessage(): string {
    return 'Record Not Found';
  }

  private getDatabaseErrorMessage(): string {
    return 'Database Error';
  }

  private getPrismaErrorMessage(
    exception: Prisma.PrismaClientKnownRequestError,
  ): string {
    switch (exception.code) {
      case 'P2002':
        return this.getDuplicateEntryMessage();
      case 'P2025':
        return this.getRecordNotFoundMessage();
      default:
        return this.getDatabaseErrorMessage();
    }
  }

  // Target formatting methods
  private formatArrayTarget(rawTarget: unknown[]): string {
    return rawTarget.join(', ');
  }

  private formatStringTarget(rawTarget: string): string {
    return rawTarget;
  }

  private formatUnknownTarget(): string {
    return 'unknown';
  }

  private formatTarget(rawTarget: unknown): string {
    if (Array.isArray(rawTarget)) {
      return this.formatArrayTarget(rawTarget);
    } else if (typeof rawTarget === 'string') {
      return this.formatStringTarget(rawTarget);
    } else {
      return this.formatUnknownTarget();
    }
  }

  // Issue handling methods
  private getDuplicateEntryIssue(target: string, rawTarget: unknown): unknown {
    return {
      field: rawTarget,
      description: `Unique constraint failed on field: ${target}`,
    };
  }

  private getRecordNotFoundIssue(
    exception: Prisma.PrismaClientKnownRequestError,
  ): unknown {
    return exception.meta ?? {};
  }

  private getDatabaseErrorIssue(
    exception: Prisma.PrismaClientKnownRequestError,
  ): unknown {
    return { message: exception.message };
  }

  private getPrismaIssue(
    exception: Prisma.PrismaClientKnownRequestError,
    target: string,
    rawTarget: unknown,
  ): unknown {
    const handlers: Record<string, () => unknown> = {
      P2002: () => this.getDuplicateEntryIssue(target, rawTarget),
      P2025: () => this.getRecordNotFoundIssue(exception),
    };

    return (
      handlers[exception.code]?.() ?? this.getDatabaseErrorIssue(exception)
    );
  }

  private handleValidationException(
    res: Response,
    formatted: Record<string, string>[] | ValidationErrorResponse,
  ) {
    return this.jsonResponse(
      res,
      HttpStatus.BAD_REQUEST,
      'Validation Failed',
      formatted,
    );
  }

  private handleHttpException(res: Response, exception: HttpException) {
    const status = exception.getStatus();
    const response = exception.getResponse();
    return this.jsonResponse(res, status, 'Http Exception', response);
  }

  private handleDefaultException(res: Response, exception: unknown) {
    const message =
      exception instanceof Error ? exception.message : 'Unexpected Error';
    return this.jsonResponse(
      res,
      HttpStatus.INTERNAL_SERVER_ERROR,
      'Internal Server Error',
      message,
    );
  }

  private jsonResponse(
    res: Response,
    status: number,
    message: string,
    issue: unknown,
  ) {
    const payload: JsonErrorResponse = {
      status: false,
      message,
      issue,
      result: null,
    };
    return res.status(status).json(payload);
  }
}

import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';
import { formatValidationIssue } from '@/utils/formatValidationIssue';

@Catch(HttpException)
export class ResultExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();

    const formattedIssue = formatValidationIssue(exceptionResponse);

    response.status(status).json({
      status: false,
      message: exception.message,
      issue: formattedIssue,
      result: null,
    });
  }
}

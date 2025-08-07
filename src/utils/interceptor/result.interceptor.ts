import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable, map } from 'rxjs';

interface Result<T> {
  status: boolean;
  message: string;
  result?: T;
}

@Injectable()
export class ResultInterceptor implements NestInterceptor {
  intercept(
    _context: ExecutionContext,
    next: CallHandler,
  ): Observable<Result<unknown>> {
    return next.handle().pipe(
      map((data: unknown) => {
        if (typeof data === 'string') {
          return {
            status: true,
            message: data,
            result: undefined,
          };
        }

        if (typeof data === 'object' || Array.isArray(data)) {
          return {
            status: true,
            message: 'Success',
            result: data,
          };
        }

        return {
          status: true,
          message: 'Success',
          result: data,
        };
      }),
    );
  }
}

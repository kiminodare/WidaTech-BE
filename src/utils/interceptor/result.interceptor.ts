// result.interceptor.ts
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
  result: T;
}

@Injectable()
export class ResultInterceptor<T> implements NestInterceptor<T, Result<T>> {
  intercept(
    context: ExecutionContext,
    next: CallHandler<T>,
  ): Observable<Result<T>> {
    return next.handle().pipe(
      map(
        (data: T): Result<T> => ({
          status: true,
          message: 'Success',
          result: data,
        }),
      ),
    );
  }
}

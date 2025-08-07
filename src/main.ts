import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ResultInterceptor } from '@/utils/interceptor/result.interceptor';
import { ResultExceptionFilter } from '@/utils/interceptor/resultException.interceptor';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new ResultExceptionFilter());
  app.useGlobalInterceptors(new ResultInterceptor());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  app.enableCors({
    origin: ['http://localhost:3002'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
    optionsSuccessStatus: 204,
  });
  await app.listen(process.env.PORT ?? 3000);
}

void bootstrap();

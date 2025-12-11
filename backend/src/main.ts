import { NestFactory } from '@nestjs/core';
import { AppModule } from './infrastructure/modules/app.module';
import { AllExceptionsFilter } from './presentation/filters/http-exception.filter';
import { ResponseTransformInterceptor } from './presentation/interceptors/response-transform.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  app.useGlobalFilters(new AllExceptionsFilter());
  app.useGlobalInterceptors(new ResponseTransformInterceptor());
  app.enableCors({
    origin: 'http://localhost:3000', // Thay bằng URL của Frontend React
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });
  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();

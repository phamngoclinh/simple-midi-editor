import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Response } from 'express';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

// Định nghĩa cấu trúc phản hồi chuẩn hóa
export interface ResponseData<T> {
  statusCode: number;
  timestamp: string;
  data: T;
}

@Injectable()
export class ResponseTransformInterceptor<T> implements NestInterceptor<
  T,
  ResponseData<T>
> {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<ResponseData<T>> {
    const ctx = context.switchToHttp();
    const response: Response = ctx.getResponse();

    // Sử dụng pipe và map để thay đổi dữ liệu phản hồi
    return next.handle().pipe(
      map((data: T) => ({
        // Lấy mã trạng thái HTTP hiện tại (ví dụ: 200, 201)
        statusCode: response.statusCode,

        // Thêm timestamp hiện tại
        timestamp: new Date().toISOString(),

        // Dữ liệu thực tế từ Controller/Service
        data: data,
      })),
    );
  }
}

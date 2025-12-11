import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { DomainException } from 'src/domain/exceptions/domain.exception';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response: Response = ctx.getResponse();
    const request: Request = ctx.getRequest();

    // 1. Xác định mã trạng thái HTTP
    const status =
      exception instanceof HttpException
        ? exception.getStatus() // Lấy mã lỗi HTTP chuẩn (404, 409, 400,...)
        : HttpStatus.INTERNAL_SERVER_ERROR; // Mặc định là 500 nếu là lỗi không xác định

    // 2. Định nghĩa thông điệp lỗi
    let message: string;
    let error: string;

    if (exception instanceof HttpException) {
      // Lấy thông điệp từ NestJS HttpException (ví dụ: ConflictException)
      const responseData = exception.getResponse();

      // NestJS thường trả về { statusCode, message, error }
      if (typeof responseData === 'object' && responseData !== null && 'message' in responseData) {
        message = Array.isArray(responseData.message)
          ? responseData.message.join(', ')
          : (responseData.message as string);
        error = (responseData.message as string) || exception.name;
      } else {
        message = exception.message;
        error = exception.name;
      }
    } else {
      // Xử lý lỗi hệ thống không mong muốn (500)
      message = exception instanceof DomainException ? exception.message : 'InternalServerError';
      error = exception instanceof DomainException ? exception.code : 'InternalServerError';
      this.logger.error(exception);
    }

    // 3. Chuẩn hóa phản hồi
    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      error: error,
      message: message, // Gửi message đã chuẩn hóa về client
    });
  }
}

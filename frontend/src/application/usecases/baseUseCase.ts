import ValidationException from '../exceptions/ValidationException';
import { Failure, Result, Success } from '../shared/result';

abstract class BaseUseCase<TInput, TResult, TContext = undefined> {
  async execute(input: TInput, context?: TContext): Promise<Result<TResult>> {
    try {
      const data = await this.handle(input, context);
      return Success(data);
    } catch (error) {
      return this.handleError(error);
    }
  }

  protected abstract handle(input: TInput, context?: TContext): Promise<TResult>;

  protected handleError(error: unknown): Result<any> {
    if (error instanceof ValidationException) {
      return Failure(error.errors, error.message);
    }

    if (error instanceof Error) {
      return Failure({ TECHNICAL_ERROR: [error.message] }, error.message);
    }

    return Failure({ UNEXPECTED_ERROR: ['Lỗi không xác định'] }, 'Lỗi không xác định');
  }
}

export default BaseUseCase;

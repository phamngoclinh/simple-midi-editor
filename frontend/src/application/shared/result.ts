export type ValidationError = Record<string, string[]>;

export type Result<T> =
  | { success: true; data: T; errors?: never; message?: string }
  | { success: false; data?: never; errors: ValidationError; message?: string };

export const Success = <T>(data: T, message?: string): Result<T> => ({
  success: true,
  data,
  message,
});

export const Failure = (errors: ValidationError, message?: string): Result<never> => ({
  success: false,
  errors,
  message,
});

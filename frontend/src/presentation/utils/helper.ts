import { ApplicationResult } from './types';

export const toMMSS = (seconds: number): string => {
  const mm = Math.floor(seconds / 60);
  const ss = seconds % 60;

  const mmStr = mm.toString().padStart(2, '0');
  const ssStr = ss.toString().padStart(2, '0');

  return `${mmStr}:${ssStr}`;
};

export const formatDate = (timeStamp: string) => {
  return new Date(timeStamp).toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const toResult = {
  success: <T>(data: T): ApplicationResult<T> => ({ success: true, data }),
  failure: <T, E extends Record<string, any> | undefined = undefined>(
    error?: E,
  ): ApplicationResult<T> => ({ success: false, data: null, error }),
};

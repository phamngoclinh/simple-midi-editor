import { useState } from 'react';
import { Result } from '../../application/shared/result';
import useModalAction from './store/useModalAction';

export function useUseCase() {
  const { showToast } = useModalAction();
  const [loading, setLoading] = useState(false);

  const call = async <T = any>(
    fn: (...args: any) => Promise<Result<T>>,
    messages: { success?: string, error?: string, extraError?: string },
    ...args: any
  ) => {
    setLoading(true);
    const result = await fn(...args);
    setLoading(false);

    if (result.success) {
      if (messages?.success) {
        showToast({
          type: 'success',
          message: messages.success,
        })
      }
    } else {
      if (messages?.error) {
        showToast({
          type: 'error',
          message: messages.error,
          extraMessage: messages?.extraError || result?.message
        })
      }
    }
    return result;
  };

  return { call, loading };
}
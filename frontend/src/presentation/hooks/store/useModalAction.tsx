import { useCallback } from 'react';
import { useModalDispatch, useModalState } from '../../../infrastructure/stores/modal/ModalContext';
import { AlertOptions, ConfirmationOptions, ToastOptions } from '../../../infrastructure/stores/modal/modalTypes';

const useModalAction = () => {
  const dispatch = useModalDispatch();
  const state = useModalState();

  const showAlert = useCallback((options: AlertOptions) => {
    dispatch({ type: 'SHOW_ALERT', payload: options })
  }, []);

  const handleCloseAlert = useCallback(() => {
    dispatch({ type: 'CLOSE_ALERT' })
  }, []);

  const showConfirmation = useCallback((options: ConfirmationOptions): Promise<boolean> => {
    return new Promise((resolve) => {
      dispatch({ type: 'SHOW_CONFIMATION', payload: { ...options, resolve } })
    });
  }, []);

  const handleConfirm = useCallback(() => {
    dispatch({ type: 'CONFIRM_CONFIMATION' })
  }, []);

  const handleCancel = useCallback(() => {
    dispatch({ type: 'CANCEL_CONFIMATION' })
  }, []);

  const showToast = useCallback((options: ToastOptions) => {
    dispatch({ type: 'SHOW_TOAST', payload: options})
  }, []);

  const handleCloseToast = useCallback((id: number) => {
    dispatch({ type: 'CLOSE_TOAST', payload: id })
  }, []);

  return {
    ...state,
    showAlert,
    handleCloseAlert,
    showConfirmation,
    handleConfirm,
    handleCancel,
    showToast,
    handleCloseToast
  }
}

export default useModalAction;
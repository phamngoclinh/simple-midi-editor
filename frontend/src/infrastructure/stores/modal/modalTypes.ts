export type AlertType = 'success' | 'error' | 'warning' | 'info';

export interface AlertOptions {
  type: AlertType;
  message: string;
  title?: string;
}

export interface ConfirmationOptions {
  message: string;
  title?: string;
  confirmButtonLabel?: string;
}

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastOptions {
  type: ToastType;
  message: string | React.ReactElement;
  extraMessage?: string;
  duration?: number;
}

export interface ToastItem extends ToastOptions {
  id: number;
}

export interface ModalState {
  alertState: { isVisible: boolean } & AlertOptions;
  confirmationState: { isVisible: boolean } & ConfirmationOptions & {
      resolve: ((confirmed: boolean) => void) | null;
    };
  toasts: ToastItem[];
}

export type ModalAction =
  | { type: 'SHOW_ALERT'; payload: AlertOptions }
  | { type: 'CLOSE_ALERT' }
  | { type: 'SHOW_TOAST'; payload: ToastOptions }
  | { type: 'CLOSE_TOAST'; payload: number }
  | {
      type: 'SHOW_CONFIMATION';
      payload: ConfirmationOptions & { resolve: ((confirmed: boolean) => void) | null };
    }
  | { type: 'CONFIRM_CONFIMATION' }
  | { type: 'CANCEL_CONFIMATION' };

import { ModalAction, ModalState, ToastItem } from './modalTypes';

let toastIdCounter = 0;

const modalReducer = (state: ModalState, action: ModalAction): ModalState => {
  switch (action.type) {
    case 'SHOW_ALERT': {
      const alertState = { ...action.payload, isVisible: true };
      return { ...state, alertState };
    }

    case 'CLOSE_ALERT': {
      const alertState = { ...state.alertState, isVisible: false };
      return { ...state, alertState };
    }

    case 'SHOW_TOAST': {
      const id = ++toastIdCounter;
      const newToast: ToastItem = { id, ...action.payload };
      const toasts = [newToast, ...state.toasts];
      return { ...state, toasts };
    }

    case 'CLOSE_TOAST': {
      const toasts = state.toasts.filter(toast => toast.id !== action.payload);
      return { ...state, toasts };
    }

    case 'SHOW_CONFIMATION': {
      const confirmationState = {
        isVisible: true,
        ...action.payload,
      };
      return { ...state, confirmationState };
    }

    case 'CONFIRM_CONFIMATION': {
      if (state.confirmationState.resolve) {
        state.confirmationState.resolve(true);
      }
      const confirmationState = {
        ...state.confirmationState,
        isVisible: false,
        resolve: null,
      };
      return { ...state, confirmationState };
    }

    case 'CANCEL_CONFIMATION': {
      if (state.confirmationState.resolve) {
        state.confirmationState.resolve(false);
      }
      const confirmationState = {
        ...state.confirmationState,
        isVisible: false,
        resolve: null,
      };
      return { ...state, confirmationState };
    }

    default:
      return state;
  }
};

export default modalReducer;

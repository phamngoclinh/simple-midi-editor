import { ModalState } from './modalTypes';

const initialModalState: ModalState = {
  alertState: {
    isVisible: false,
    type: 'info',
    message: '',
  },
  confirmationState: {
    isVisible: false,
    message: '',
    resolve: null,
  },
  toasts: [],
};

export default initialModalState;

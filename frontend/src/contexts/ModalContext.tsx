import React, { createContext, ReactNode, useCallback, useContext, useState } from 'react';
import Alert from '../components/common/Alert';
import Confirmation from '../components/common/Confirmation';
import Toast from '../components/common/Toast';

// --- 1. Định nghĩa Types ---

type AlertType = 'success' | 'error' | 'warning' | 'info';

interface AlertOptions {
  type: AlertType;
  message: string;
  title?: string;
}

interface ConfirmationOptions {
  message: string;
  title?: string;
  confirmButtonLabel?: string;
}

type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ToastOptions {
  type: ToastType;
  message: string | React.ReactElement;
  extraMessage?: string;
  duration?: number;
}

interface ToastItem extends ToastOptions {
  id: number;
}

interface ModalContextType {
  showAlert: (options: AlertOptions) => void;
  showConfirmation: (options: ConfirmationOptions) => Promise<boolean>;
  showToast: (options: ToastOptions) => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

interface ModalProviderProps {
  children: ReactNode;
}

let toastIdCounter = 0;

export const ModalProvider: React.FC<ModalProviderProps> = ({ children }) => {
  const [alertState, setAlertState] = useState<{ isVisible: boolean } & AlertOptions>({
    isVisible: false,
    type: 'info',
    message: '',
  });

  const [confirmationState, setConfirmationState] = useState<{ isVisible: boolean } & ConfirmationOptions & {
    resolve: ((confirmed: boolean) => void) | null
  }>({
    isVisible: false,
    message: '',
    resolve: null,
  });

  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const showAlert = useCallback((options: AlertOptions) => {
    setAlertState({
      isVisible: true,
      ...options,
    });
  }, []);

  const handleCloseAlert = useCallback(() => {
    setAlertState(prev => ({ ...prev, isVisible: false }));
  }, []);

  const showConfirmation = useCallback((options: ConfirmationOptions): Promise<boolean> => {
    return new Promise((resolve) => {
      setConfirmationState({
        isVisible: true,
        ...options,
        resolve,
      });
    });
  }, []);

  const handleConfirm = useCallback(() => {
    if (confirmationState.resolve) {
      confirmationState.resolve(true);
    }
    setConfirmationState(prev => ({ ...prev, isVisible: false, resolve: null }));
  }, [confirmationState]);

  const handleCancel = useCallback(() => {
    if (confirmationState.resolve) {
      confirmationState.resolve(false);
    }
    setConfirmationState(prev => ({ ...prev, isVisible: false, resolve: null }));
  }, [confirmationState]);

  const showToast = useCallback((options: ToastOptions) => {
    const id = ++toastIdCounter;
    const newToast: ToastItem = { id, ...options };
    
    setToasts((prevToasts) => [newToast, ...prevToasts]);
  }, []);

  const handleCloseToast = useCallback((id: number) => {
    setToasts((prevToasts) => prevToasts.filter(toast => toast.id !== id));
  }, []);

  const contextValue: ModalContextType = {
    showAlert,
    showConfirmation,
    showToast,
  };

  return (
    <ModalContext.Provider value={contextValue}>
      {children}

      <Alert
        isVisible={alertState.isVisible}
        type={alertState.type}
        message={alertState.message}
        title={alertState.title}
        onClose={handleCloseAlert}
      />

      <Confirmation
        isVisible={confirmationState.isVisible}
        message={confirmationState.message}
        title={confirmationState.title}
        confirmButtonLabel={confirmationState.confirmButtonLabel}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />

      <div style={toastContainerStyle}>
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            id={toast.id}
            type={toast.type}
            message={toast.message}
            extraMessage={toast.extraMessage}
            duration={toast.duration}
            onClose={handleCloseToast}
          />
        ))}
      </div>
    </ModalContext.Provider>
  );
};

export const useModal = () => {
  const context = useContext(ModalContext);
  if (context === undefined) {
    throw new Error('useModal phải được sử dụng trong ModalProvider');
  }
  return context;
};

const toastContainerStyle: React.CSSProperties = {
  position: 'fixed',
  bottom: '20px',
  right: '20px',
  zIndex: 10000,
  display: 'flex',
  flexDirection: 'column-reverse',
  alignItems: 'flex-end',
  gap: '10px',
};
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
  message: string;
  duration?: number;
}

interface ToastItem extends ToastOptions {
  id: number;
}

interface ModalContextType {
  // Hàm hiển thị Alert
  showAlert: (options: AlertOptions) => void;
  // Hàm hiển thị Confirmation, trả về Promise để xử lý đồng bộ
  showConfirmation: (options: ConfirmationOptions) => Promise<boolean>;
  showToast: (options: ToastOptions) => void;
}

// Giá trị mặc định cho Context
const ModalContext = createContext<ModalContextType | undefined>(undefined);

// --- 2. Component Provider ---

interface ModalProviderProps {
  children: ReactNode;
}

let toastIdCounter = 0;

export const ModalProvider: React.FC<ModalProviderProps> = ({ children }) => {
  // State quản lý Alert
  const [alertState, setAlertState] = useState<{ isVisible: boolean } & AlertOptions>({
    isVisible: false,
    type: 'info',
    message: '',
  });

  // State quản lý Confirmation
  const [confirmationState, setConfirmationState] = useState<{ isVisible: boolean } & ConfirmationOptions & {
    resolve: ((confirmed: boolean) => void) | null
  }>({
    isVisible: false,
    message: '',
    resolve: null,
  });

  const [toasts, setToasts] = useState<ToastItem[]>([]);

  // --- Logic cho Alert ---
  const showAlert = useCallback((options: AlertOptions) => {
    setAlertState({
      isVisible: true,
      ...options,
    });
  }, []);

  const handleCloseAlert = useCallback(() => {
    setAlertState(prev => ({ ...prev, isVisible: false }));
  }, []);

  // --- Logic cho Confirmation (sử dụng Promise) ---
  const showConfirmation = useCallback((options: ConfirmationOptions): Promise<boolean> => {
    return new Promise((resolve) => {
      setConfirmationState({
        isVisible: true,
        ...options,
        resolve, // Lưu hàm resolve của Promise vào state
      });
    });
  }, []);

  const handleConfirm = useCallback(() => {
    if (confirmationState.resolve) {
      confirmationState.resolve(true); // Gửi true về cho Promise
    }
    setConfirmationState(prev => ({ ...prev, isVisible: false, resolve: null }));
  }, [confirmationState]);

  const handleCancel = useCallback(() => {
    if (confirmationState.resolve) {
      confirmationState.resolve(false); // Gửi false về cho Promise
    }
    setConfirmationState(prev => ({ ...prev, isVisible: false, resolve: null }));
  }, [confirmationState]);

  // --- Logic cho Toast ---
  const showToast = useCallback((options: ToastOptions) => {
    const id = ++toastIdCounter;
    const newToast: ToastItem = { id, ...options };
    
    // Thêm Toast mới vào đầu danh sách (để hiển thị ở trên cùng)
    setToasts((prevToasts) => [newToast, ...prevToasts]);
  }, []);

  const handleCloseToast = useCallback((id: number) => {
    // Loại bỏ Toast theo ID
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

      {/* Render các component Modal/Alert cố định */}

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
            duration={toast.duration}
            onClose={handleCloseToast}
          />
        ))}
      </div>
    </ModalContext.Provider>
  );
};

// --- 3. Custom Hook (Sử dụng tiện lợi) ---

export const useModal = () => {
  const context = useContext(ModalContext);
  if (context === undefined) {
    throw new Error('useModal phải được sử dụng trong ModalProvider');
  }
  return context;
};

const toastContainerStyle: React.CSSProperties = {
  position: 'fixed',
  bottom: '20px', // Đặt ở góc dưới bên phải
  right: '20px',
  zIndex: 10000,
  display: 'flex',
  flexDirection: 'column-reverse', // Đảo ngược thứ tự để Toast mới hiện ở trên
  alignItems: 'flex-end',
};
// src/components/common/Confirmation.tsx
import React from 'react';
import { backdropStyle, bodyStyle, closeButtonStyle, headerStyle, modalContentStyle, modalFooterStyle } from './Modal.styles';

interface ConfirmationProps {
  isVisible: boolean;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  title?: string;
  confirmButtonLabel?: string;
}

const Confirmation: React.FC<ConfirmationProps> = ({
  isVisible,
  message,
  onConfirm,
  onCancel,
  title = "Xác Nhận Hành Động",
  confirmButtonLabel = "Xác nhận",
}) => {
  if (!isVisible) return null;

  return (
    <div style={confirmationModalStyle}>
      <div style={modalContentStyle} className='bg-white dark:bg-[#111318]'>

        {/* Header Xác nhận */}
        <div style={modalHeaderStyleWarning}>
          <h3>{title}</h3>
          <button onClick={onCancel} style={closeButtonStyleWarning}>&times;</button>
        </div>

        {/* Nội dung Xác nhận */}
        <div style={bodyStyle}>
          <p>{message}</p>
        </div>

        {/* Footer (Nút Xác nhận & Hủy) */}
        <div style={modalFooterStyle}>
          <button onClick={onCancel} style={cancelActionButtonStyle}>
            Hủy
          </button>
          <button onClick={onConfirm} style={confirmActionButtonStyle}>
            {confirmButtonLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Confirmation;

// --- Styles Bổ sung (Tái sử dụng các styles chung từ Alert) ---

const confirmationModalStyle: React.CSSProperties = {
  ...backdropStyle,
  zIndex: 10000,
}

const modalHeaderStyleWarning: React.CSSProperties = {
  ...headerStyle,
};

const closeButtonStyleWarning: React.CSSProperties = {
  ...closeButtonStyle,
  color: 'white',
};

const confirmActionButtonStyle: React.CSSProperties = {
  padding: '8px 15px',
  backgroundColor: '#f44336', // Màu đỏ cho hành động nguy hiểm
  color: 'white',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
  marginLeft: '10px',
};

const cancelActionButtonStyle: React.CSSProperties = {
  padding: '8px 15px',
  backgroundColor: '#6c757d',
  color: 'white',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
};

// Tái sử dụng: modalOverlayStyle, modalContentStyle, titleStyle, modalBodyStyle, modalFooterStyle
// (Lưu ý: Trong dự án thực tế, nên định nghĩa các styles chung này trong một file riêng như `styles/modalStyles.ts`)
// src/components/common/Modal.tsx
import React from 'react';
import ReactDOM from 'react-dom';
import { backdropStyle, bodyStyle, closeButtonStyle, headerStyle, modalContentStyle } from './Modal.styles';

interface ModalProps {
  /** Trạng thái hiển thị Modal (true/false). */
  isOpen: boolean;
  /** Hàm được gọi khi người dùng muốn đóng Modal (ví dụ: click overlay hoặc nút đóng). */
  onClose: () => void;
  /** Tiêu đề của Modal. */
  title: string;
  /** Nội dung Modal (thường là SongForm). */
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  // Render Modal ra ngoài root DOM element bằng Portal
  return ReactDOM.createPortal(
    <div style={backdropStyle} onClick={onClose}>
      <div style={modalContentStyle} onClick={(e) => e.stopPropagation()}>
        <div style={headerStyle}>
          <h3>{title}</h3>
          <button onClick={onClose} style={closeButtonStyle}>
            &times;
          </button>
        </div>
        <div style={bodyStyle}>
          {children}
        </div>
      </div>
    </div>,
    document.body // Thường là document.body để đảm bảo Modal nằm trên tất cả
  );
};

export default Modal;

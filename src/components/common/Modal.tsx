// src/components/common/Modal.tsx
import React from 'react';
import ReactDOM from 'react-dom';

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

// --- Styles cho Modal ---

const backdropStyle: React.CSSProperties = {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 1000,
};

const modalContentStyle: React.CSSProperties = {
  backgroundColor: '#fff',
  padding: '20px',
  borderRadius: '8px',
  maxWidth: '500px',
  width: '90%',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
  position: 'relative',
};

const headerStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '15px',
    borderBottom: '1px solid #eee',
    paddingBottom: '10px',
};

const bodyStyle: React.CSSProperties = {
    paddingTop: '10px',
};

const closeButtonStyle: React.CSSProperties = {
  background: 'none',
  border: 'none',
  fontSize: '1.5em',
  cursor: 'pointer',
  color: '#aaa',
};
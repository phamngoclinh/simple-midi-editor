import React from 'react';

type AlertType = 'success' | 'error' | 'warning' | 'info';

interface AlertProps {
  isVisible: boolean;
  type: AlertType;
  message: string;
  onClose: () => void;
  title?: string;
}

const Alert: React.FC<AlertProps> = ({ isVisible, type, message, onClose, title }) => {
  if (!isVisible) return null;

  const getStyle = (type: AlertType) => {
    switch (type) {
      case 'success':
        return { backgroundColor: '#4CAF50', borderColor: '#4CAF50' }; // Xanh lá
      case 'error':
        return { backgroundColor: '#f44336', borderColor: '#f44336' }; // Đỏ
      case 'warning':
        return { backgroundColor: '#ff9800', borderColor: '#ff9800' }; // Cam
      case 'info':
      default:
        return { backgroundColor: '#2196F3', borderColor: '#2196F3' }; // Xanh dương
    }
  };

  const headerStyle = getStyle(type);

  return (
    <div style={modalOverlayStyle}>
      <div style={modalContentStyle}>
        <div style={{ ...modalHeaderStyle, ...headerStyle }}>
          <h3 style={titleStyle}>{title || type.toUpperCase()}</h3>
          <button onClick={onClose} style={closeButtonStyle}>
            &times;
          </button>
        </div>

        <div style={modalBodyStyle}>
          <p>{message}</p>
        </div>

        <div style={modalFooterStyle}>
          <button onClick={onClose} style={actionButtonStyle}>
            Đã hiểu
          </button>
        </div>
      </div>
    </div>
  );
};

export default Alert;

// --- Styles (Chung cho Modal) ---

const modalOverlayStyle: React.CSSProperties = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 1000,
};

const modalContentStyle: React.CSSProperties = {
  backgroundColor: 'white',
  borderRadius: '8px',
  width: '90%',
  maxWidth: '400px',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
  overflow: 'hidden',
};

const modalHeaderStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '10px 15px',
  color: 'white',
};

const titleStyle: React.CSSProperties = {
  margin: 0,
  fontSize: '1.2em',
};

const closeButtonStyle: React.CSSProperties = {
  background: 'none',
  border: 'none',
  color: 'white',
  fontSize: '1.5em',
  cursor: 'pointer',
};

const modalBodyStyle: React.CSSProperties = {
  padding: '20px 15px',
  fontSize: '1em',
};

const modalFooterStyle: React.CSSProperties = {
  padding: '10px 15px',
  borderTop: '1px solid #eee',
  display: 'flex',
  justifyContent: 'flex-end',
};

const actionButtonStyle: React.CSSProperties = {
  padding: '8px 15px',
  backgroundColor: '#555',
  color: 'white',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
};

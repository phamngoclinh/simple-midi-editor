import React, { memo, useEffect, useState } from 'react';

type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ToastProps {
  id: number;
  type: ToastType;
  message: string;
  duration?: number;
  onClose: (id: number) => void;
}

const getStyles = (type: ToastType) => {
  switch (type) {
    case 'success':
      return { backgroundColor: '#4CAF50', icon: '✔️' };
    case 'error':
      return { backgroundColor: '#f44336', icon: '❌' };
    case 'warning':
      return { backgroundColor: '#ff9800', icon: '⚠️' };
    case 'info':
    default:
      return { backgroundColor: '#2196F3', icon: 'ℹ️' };
  }
};

const Toast: React.FC<ToastProps> = memo(({ id, type, message, duration = 3000, onClose }) => {
  const [isFading, setIsFading] = useState(false);
  const styles = getStyles(type);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsFading(true);
    }, duration);

    const fadeTimer = setTimeout(() => {
      onClose(id);
    }, duration + 500);

    return () => {
      clearTimeout(timer);
      clearTimeout(fadeTimer);
    };
  }, [duration, id, onClose]);

  const handleClose = () => {
      setIsFading(true);
      setTimeout(() => onClose(id), 500);
  };

  return (
    <div 
      style={{
        ...toastStyle,
        backgroundColor: styles.backgroundColor,
        opacity: isFading ? 0 : 1,
        transition: 'opacity 0.5s ease-out',
      }}
      onClick={handleClose}
    >
      <span style={iconStyle}>{styles.icon}</span>
      <p style={messageStyle}>{message}</p>
      <button style={closeButtonStyle} onClick={handleClose}>&times;</button>
    </div>
  );
});

export default Toast;

const toastStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  padding: '12px 15px',
  borderRadius: '4px',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
  color: 'white',
  marginBottom: '10px',
  cursor: 'pointer',
  maxWidth: '350px',
};

const iconStyle: React.CSSProperties = {
  fontSize: '1.2em',
  marginRight: '10px',
};

const messageStyle: React.CSSProperties = {
  margin: 0,
  flexGrow: 1,
  fontSize: '0.95em',
  fontWeight: '500',
};

const closeButtonStyle: React.CSSProperties = {
  background: 'none',
  border: 'none',
  color: 'white',
  fontSize: '1.2em',
  cursor: 'pointer',
  marginLeft: '15px',
  padding: 0,
};
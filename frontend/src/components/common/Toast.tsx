import React, { memo, useEffect } from 'react';

type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ToastProps {
  id: number;
  type: ToastType;
  message: string;
  extraMessage?: string;
  duration?: number;
  onClose: (id: number) => void;
}

const getStyles = (type: ToastType) => {
  switch (type) {
    case 'success':
      return { backgroundColor: 'green', icon: 'check_circle' };
    case 'error':
      return { backgroundColor: 'red', icon: 'close' };
    case 'warning':
      return { backgroundColor: 'yellow', icon: 'warning' };
    case 'info':
    default:
      return { backgroundColor: 'blue', icon: 'info' };
  }
};

const Toast: React.FC<ToastProps> = memo(({ id, type, message, extraMessage, duration = 3000, onClose }) => {
  const styles = getStyles(type);

  useEffect(() => {
    const fadeTimer = setTimeout(() => {
      onClose(id);
    }, duration + 500);

    return () => {
      clearTimeout(fadeTimer);
    };
  }, [duration, id, onClose]);

  const handleClose = () => {
    setTimeout(() => onClose(id), 500);
  };

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-lg bg-surface-dark border border-[#3b4354] shadow-2xl shadow-black/50 animate-in slide-in-from-bottom-5 fade-in duration-300">
      <div className="flex items-center gap-3 p-4">
        <div className={`flex items-center justify-center shrink-0 size-8 rounded-full bg-${styles.backgroundColor}-500/10 text-${styles.backgroundColor}-500`}>
          <span className="material-symbols-outlined text-[20px]">{styles.icon}</span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-white font-medium leading-normal truncate">{message}</p>
          {extraMessage && <p className="text-gray-400 text-sm leading-normal truncate">{extraMessage}</p>}
        </div>
        <button onClick={handleClose} className="shrink-0 flex text-gray-400 hover:text-white transition-colors p-1 rounded hover:bg-white/10">
          <span className="material-symbols-outlined text-[18px]">close</span>
        </button>
      </div>
    </div>
  )
});

export default Toast;

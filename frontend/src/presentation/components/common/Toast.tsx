'use client';

import React, { memo, useEffect } from 'react';

type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ToastProps {
  id: number;
  type: ToastType;
  message: string | React.ReactElement;
  extraMessage?: string;
  duration?: number;
  onClose: (id: number) => void;
}

const getStyles = (type: ToastType) => {
  switch (type) {
    case 'success':
      return { containerClass: 'bg-green-500/10 text-green-500', icon: 'check_circle' };
    case 'error':
      return { containerClass: 'bg-red-500/10 text-red-500', icon: 'close' };
    case 'warning':
      return { containerClass: 'bg-yellow-500/10 text-yellow-500', icon: 'warning' };
    case 'info':
    default:
      return { containerClass: 'bg-blue-500/10 text-blue-500', icon: 'info' };
  }
};

const Toast: React.FC<ToastProps> = memo(
  ({ id, type, message, extraMessage, duration = 3000, onClose }) => {
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
      <div className="group relative flex flex-col overflow-hidden max-w-[400px] rounded-lg bg-background border border-border shadow-2xl shadow-black/50 animate-in slide-in-from-bottom-5 fade-in duration-300">
        <div className="flex items-center gap-3 p-4">
          <div
            className={`flex items-center justify-center shrink-0 size-8 rounded-full ${styles.containerClass}`}
          >
            <span className="material-symbols-outlined text-[20px]">{styles.icon}</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-foreground font-medium leading-normal truncate">{message}</p>
            {extraMessage && (
              <p className="text-muted-foreground text-sm leading-normal">{extraMessage}</p>
            )}
          </div>
          <button
            onClick={handleClose}
            className="shrink-0 flex text-muted-foreground hover:text-foreground transition-colors p-1 rounded hover:bg-muted"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>
      </div>
    );
  },
);

Toast.displayName = 'Toast';

export default Toast;

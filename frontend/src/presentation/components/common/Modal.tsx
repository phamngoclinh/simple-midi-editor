'use client';

import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import { DefaultButton, PrimaryButton } from './Button';
import { useTranslations } from 'next-intl';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOk?: () => void;
  title: string;
  subTitle?: string;
  textOk?: string;
  textClose?: string;
  children: React.ReactNode;
  actionsRight?: React.ReactElement[];
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  onOk,
  title,
  subTitle,
  textOk,
  textClose,
  actionsRight,
  children,
}) => {
  const t = useTranslations('Common');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div style={backdropStyle} className="animate-fade-in">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-0"></div>
      <div className="relative z-10 w-full max-w-[800px] bg-background rounded-xl shadow-2xl border border-border flex flex-col max-h-[90vh] animate-fade-in-up">
        <div className="flex items-start justify-between px-8 py-6 border-b border-border bg-muted/30 rounded-t-xl shrink-0">
          <div className="flex flex-col gap-1">
            <h2 className="text-foreground tracking-tight text-2xl font-bold leading-tight">
              {title}
            </h2>
            {subTitle && <p className="text-text-subtle font-normal">{subTitle}</p>}
          </div>
          <button
            onClick={onClose}
            className="cursor-pointer text-muted-foreground hover:text-foreground transition-colors p-2 rounded-lg hover:bg-muted group"
          >
            <span className="material-symbols-outlined !text-[24px]">close</span>
          </button>
        </div>
        <div className="flex-1 overflow-y-auto custom-scrollbar px-8 py-6 space-y-8">
          {children}
        </div>
        <div className="p-6 border-t border-border bg-muted/30 rounded-b-xl shrink-0 flex items-center justify-end gap-3">
          <DefaultButton onClick={onClose} className="bg-transparent border border-border">
            <span className="truncate">{textClose || t('cancel')}</span>
          </DefaultButton>
          {textOk && (
            <PrimaryButton onClick={onOk}>
              <span className="truncate">{textOk}</span>
            </PrimaryButton>
          )}
          {actionsRight &&
            actionsRight.map((action, index) => (
              <React.Fragment key={index}>{action}</React.Fragment>
            ))}
        </div>
      </div>
    </div>,
    document.body,
  );
};

export default Modal;

const backdropStyle: React.CSSProperties = {
  position: 'absolute',
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

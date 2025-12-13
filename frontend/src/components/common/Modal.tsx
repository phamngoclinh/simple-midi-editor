import React from 'react';
import ReactDOM from 'react-dom';
import { backdropStyle } from './Modal.styles';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOk?: () => void;
  title: string;
  subTitle?: string;
  textOk?: string;
  textClose?: string;
  children: React.ReactNode;
  actionsRight?: React.ReactElement[]
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, onOk, title, subTitle, textOk, textClose, actionsRight, children }) => {
  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div style={backdropStyle}>
      <div className="absolute inset-0 bg-background-dark/80 backdrop-blur-sm z-0"></div>
      <div className="relative z-10 w-full max-w-[800px] bg-surface-dark rounded-xl shadow-2xl border border-border-dark flex flex-col max-h-[90vh] animate-fade-in-up">
        <div className="flex items-start justify-between px-8 py-6 border-b border-border-dark bg-surface-dark/50 rounded-t-xl shrink-0">
          <div className="flex flex-col gap-1">
            <h2 className="text-white tracking-tight text-2xl font-bold leading-tight">{title}</h2>
            {subTitle && <p className="text-text-subtle text-sm font-normal">{subTitle}</p>}
          </div>
          <button onClick={onClose} className="text-text-subtle hover:text-white transition-colors p-2 rounded-lg hover:bg-white/5 group">
            <span className="material-symbols-outlined !text-[24px]">close</span>
          </button>
        </div>
        <div className="flex-1 overflow-y-auto custom-scrollbar px-8 py-6 space-y-8">
          {children}
        </div>
        <div
          className="p-6 border-t border-border-dark bg-surface-dark/50 rounded-b-xl shrink-0 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-transparent text-white text-sm font-bold leading-normal tracking-[0.015em] hover:bg-white/5 border border-border-dark transition-colors">
            <span className="truncate">{textClose || 'Hủy bỏ'}</span>
          </button>
          {textOk && <button
            onClick={onOk}
            className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-primary text-white text-sm font-bold leading-normal tracking-[0.015em] hover:bg-blue-600 shadow-lg shadow-blue-900/20 transition-all">
            <span className="truncate">{textOk}</span>
          </button>}
          {actionsRight && actionsRight.map((action, index) => <React.Fragment key={index}>{action}</React.Fragment>)}
        </div>
      </div>
    </div>,
    document.body
  );
};

export default Modal;

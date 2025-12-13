import React from 'react';

interface ConfirmationProps {
  isVisible: boolean;
  message?: string;
  onConfirm: () => void;
  onCancel: () => void;
  title?: string;
  confirmButtonLabel?: string;
}

const Confirmation: React.FC<ConfirmationProps> = ({
  isVisible,
  message = 'Bạn có chắc chắn thực hiện thao tác này không?',
  onConfirm,
  onCancel,
  title = "Xác Nhận Hành Động",
  confirmButtonLabel = "Xác nhận",
}) => {
  if (!isVisible) return null;

  return (
    <div className="confirmation-modal absolute inset-0 z-[10000] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-surface-dark border border-white/10 rounded-xl shadow-2xl overflow-hidden transform transition-all scale-100">
        <div className="flex flex-col items-center pt-8 pb-4 px-6 text-center">
          <div
            className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mb-4 ring-1 ring-red-500/20">
            <span className="material-symbols-outlined text-red-500 text-3xl">warning</span>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">{title}</h2>
          {message && <p className="text-slate-400 text-base leading-relaxed">
            {message}
          </p>}
        </div>

        <div className="p-6 pt-2">
          <div className="flex flex-col-reverse sm:flex-row gap-3 justify-center">
            <button onClick={onCancel} className="flex-1 flex cursor-pointer items-center justify-center rounded-lg h-11 p-4 bg-white/5 hover:bg-white/10 text-white font-bold tracking-[0.015em] transition-colors border border-white/5 hover:border-white/10 focus:outline-none focus:ring-2 focus:ring-white/20">
              <span>Hủy</span>
            </button>
            <button autoFocus onClick={onConfirm} className="flex-1 flex cursor-pointer items-center justify-center rounded-lg h-11 p-4 bg-primary hover:bg-blue-600 text-white font-bold tracking-[0.015em] shadow-lg shadow-primary/25 transition-all hover:shadow-primary/40 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-[#1a1d23]">
              <span className="material-symbols-outlined text-[18px] mr-2">check</span>
              <span>{confirmButtonLabel}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
};

export default Confirmation;

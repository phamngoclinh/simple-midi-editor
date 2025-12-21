import React from 'react';
import { DefaultButton, PrimaryButton } from './Button';

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
  title = 'Xác Nhận Hành Động',
  confirmButtonLabel = 'Xác nhận',
}) => {
  if (!isVisible) return null;

  return (
    <div className='confirmation-modal absolute inset-0 z-[10000] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200'>
      <div className='w-full max-w-md bg-surface-dark border border-white/10 rounded-xl shadow-2xl overflow-hidden transform transition-all scale-100'>
        <div className='flex flex-col items-center pt-8 pb-4 px-6 text-center'>
          <div
            className='w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mb-4 ring-1 ring-red-500/20'>
            <span className='material-symbols-outlined text-red-500 text-3xl'>warning</span>
          </div>
          <h2 className='text-2xl font-bold text-white mb-2'>{title}</h2>
          {message && <p className='text-slate-400 text-base leading-relaxed'>
            {message}
          </p>}
        </div>

        <div className='p-6 pt-2'>
          <div className='flex flex-col-reverse sm:flex-row gap-3 justify-center'>
            <DefaultButton onClick={onCancel} className='flex-1'>Hủy</DefaultButton>
            <PrimaryButton autoFocus onClick={onConfirm} className='flex-1'>
              <span className='material-symbols-outlined text-[18px] mr-2'>check</span>
              <span>{confirmButtonLabel}</span>
            </PrimaryButton>
          </div>
        </div>
      </div>
    </div>
  )
};

export default Confirmation;

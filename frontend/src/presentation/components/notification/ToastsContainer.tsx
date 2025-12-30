'use client';

import useModalAction from '../../hooks/store/useModalAction';
import Toast from '../common/Toast';

const ToastsContainer = () => {
  const { toasts, handleCloseToast } = useModalAction();

  return (
    <div className="fixed bottom-[20px] right-[20px] z-[10000] flex flex-col-reverse items-end gap-[10px]">
      {toasts.map(toast => (
        <Toast
          key={toast.id}
          id={toast.id}
          type={toast.type}
          message={toast.message}
          extraMessage={toast.extraMessage}
          duration={toast.duration}
          onClose={handleCloseToast}
        />
      ))}
    </div>
  );
};

export default ToastsContainer;

import { DefaultButton, PrimaryButton } from './Button';
import { useTranslations } from 'next-intl';

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
  message,
  onConfirm,
  onCancel,
  title,
  confirmButtonLabel,
}) => {
  const t = useTranslations('Common');
  const tDefault = useTranslations('Confirmation');

  if (!isVisible) return null;

  const displayTitle = title || tDefault('deleteSongTitle'); // Fallback if needed, but usually passed
  const displayMessage = message || tDefault('deleteSongMessage');
  const displayConfirmLabel = confirmButtonLabel || tDefault('deleteSongAction');

  return (
    <div className="confirmation-modal absolute inset-0 z-[10000] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-background border border-border rounded-xl shadow-2xl overflow-hidden transform transition-all scale-100">
        <div className="flex flex-col items-center pt-8 pb-4 px-6 text-center">
          <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mb-4 ring-1 ring-red-500/20">
            <span className="material-symbols-outlined text-red-500 text-3xl">warning</span>
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-2">{displayTitle}</h2>
          {displayMessage && (
            <p className="text-muted-foreground text-base leading-relaxed">{displayMessage}</p>
          )}
        </div>

        <div className="p-6 pt-2">
          <div className="flex flex-col-reverse sm:flex-row gap-3 justify-center">
            <DefaultButton onClick={onCancel} className="flex-1">
              {t('cancel')}
            </DefaultButton>
            <PrimaryButton autoFocus onClick={onConfirm} className="flex-1">
              <span className="material-symbols-outlined text-[18px] mr-2">check</span>
              <span>{displayConfirmLabel}</span>
            </PrimaryButton>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Confirmation;

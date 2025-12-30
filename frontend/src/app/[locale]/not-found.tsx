import { useTranslations } from 'next-intl';
import { Link } from '../../i18n/routing';

export default function NotFound() {
  const t = useTranslations('NotFound');

  return (
    <div className="flex flex-col items-center justify-center h-full text-white">
      <h2 className="text-2xl font-bold mb-4">{t('title')}</h2>
      <Link href="/" className="text-primary hover:underline">
        {t('returnHome')}
      </Link>
    </div>
  );
}

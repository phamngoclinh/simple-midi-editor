'use client';

import { useLocale } from 'next-intl';
import { usePathname, useRouter } from '../../../i18n/routing';
import { useTransition } from 'react';

const LanguageSwitcher = () => {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const toggleLanguage = () => {
    const nextLocale = locale === 'en' ? 'vi' : 'en';
    startTransition(() => {
      router.replace(pathname, { locale: nextLocale });
    });
  };

  return (
    <button
      onClick={toggleLanguage}
      disabled={isPending}
      className="h-11 flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border bg-input hover:border-primary/50 transition-all text-sm font-medium text-foreground disabled:opacity-50 cursor-pointer"
      title={locale === 'en' ? 'Switch to Vietnamese' : 'Chuyển sang tiếng Anh'}
    >
      <span className="material-symbols-outlined text-[18px]">language</span>
      <span className="uppercase">{locale}</span>
    </button>
  );
};

export default LanguageSwitcher;

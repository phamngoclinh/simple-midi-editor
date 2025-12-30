'use client';

import React from 'react';
import useImportExportSong from '../../hooks/song/useImportExportSong';
import { DefaultButton } from '../common/Button';
import ThemeToggle from '../common/ThemeToggle';
import LanguageSwitcher from '../common/LanguageSwitcher';
import { Link } from '../../../i18n/routing';
import { useTranslations } from 'next-intl';

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const { importSong } = useImportExportSong();
  const tHome = useTranslations('Home');

  return (
    <div className="flex flex-col h-full bg-background text-foreground">
      <header className="flex-none flex items-center justify-between whitespace-nowrap border-b border-solid border-border bg-background px-6 py-3 z-20">
        <div className="flex items-center gap-2 text-foreground">
          <div className="size-8 text-primary">
            <span className="material-symbols-outlined !text-3xl">piano</span>
          </div>
          <Link
            href="/"
            className="text-foreground text-xl font-bold leading-tight tracking-[-0.015em]"
          >
            Simple Midi Editor
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <DefaultButton onClick={importSong}>
            <span className="material-symbols-outlined text-sm mr-2">ios_share</span>{' '}
            {tHome('importButton')}
          </DefaultButton>
          <LanguageSwitcher />
          <ThemeToggle />
        </div>
      </header>
      <div className="flex flex-1 overflow-hidden">{children}</div>
      <footer className="bg-footer text-footer-foreground py-[10px] text-center text-xs">
        <p>&copy; 2025 Simple Midi Editor</p>
      </footer>
    </div>
  );
};

export default AppLayout;

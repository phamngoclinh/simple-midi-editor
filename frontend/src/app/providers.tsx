'use client';

import React from 'react';
import { ThemeProvider } from 'next-themes';
import { ModalProvider as RealModalProvider } from '../infrastructure/stores/modal/ModalContext';
import { StudioProvider as RealStudioProvider } from '../infrastructure/stores/studio';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <RealModalProvider>
        <RealStudioProvider>{children}</RealStudioProvider>
      </RealModalProvider>
    </ThemeProvider>
  );
}

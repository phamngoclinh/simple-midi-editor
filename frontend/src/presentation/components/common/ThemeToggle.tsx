'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { DefaultButton } from './Button';

const ThemeToggle = () => {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  // useEffect only runs on the client, so now we can safely show the UI
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <DefaultButton onClick={toggleTheme} className="!p-2 min-w-0" aria-label="Toggle theme">
      <span className="material-symbols-outlined text-[20px]">
        {theme === 'dark' ? 'light_mode' : 'dark_mode'}
      </span>
    </DefaultButton>
  );
};

export default ThemeToggle;

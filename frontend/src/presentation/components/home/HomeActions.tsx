'use client';

import React from 'react';
import { PrimaryButton } from '../common/Button';
import useStudioAction from '../../hooks/store/useStudioAction';
import { useTranslations } from 'next-intl';

const HomeActions: React.FC = () => {
  const { openCreateSongFormModal } = useStudioAction();
  const t = useTranslations('Home');

  return (
    <div className="flex items-center gap-3">
      <PrimaryButton onClick={openCreateSongFormModal}>
        <span className="material-symbols-outlined text-[20px]">add</span>
        <span>{t('createButton')}</span>
      </PrimaryButton>
    </div>
  );
};

export default HomeActions;

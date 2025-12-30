'use client';

import { useMemo, useRef } from 'react';
import useImportExportSong from '../../hooks/song/useImportExportSong';
import { useSongFormInitializer } from '../../hooks/song/useSongFormInitializer';
import useUpdateSong from '../../hooks/song/useUpdateSong';
import { ChildFormHandles } from '../../utils/types';
import Aside from '../common/Aside';
import SongForm from '../song/SongForm';
import { PrimaryButton, SecondaryButton } from '../common/Button';
import { useTranslations } from 'next-intl';
import { useRouter } from '../../../i18n/routing';

interface AsideSongFormProps {
  songId: string;
}

const AsideSongForm = ({ songId }: AsideSongFormProps) => {
  const { exportSong } = useImportExportSong();
  const { initializeUpdateForm } = useSongFormInitializer();
  const { updateSong } = useUpdateSong();
  const formRef = useRef<ChildFormHandles>(null);
  const t = useTranslations('Editor');
  const tCommon = useTranslations('Common');
  const router = useRouter();

  const songFormData = useMemo(() => {
    return initializeUpdateForm(songId);
  }, [songId, initializeUpdateForm]);

  return (
    <Aside
      title={t('editSong')}
      subTitle={t('editSongDetails')}
      actions={[
        <SecondaryButton key="export" onClick={() => exportSong(songId)} className="flex-1">
          <span className="material-symbols-outlined text-lg mr-2">arrow_downward</span>{' '}
          {t('export')}
        </SecondaryButton>,
        <SecondaryButton
          key="event-list"
          onClick={() => router.push(`/editor/${songId}/event-list`)}
          className="w-full"
        >
          <span className="material-symbols-outlined text-lg mr-2">list_alt</span>
          {tCommon('viewEventList')}
        </SecondaryButton>,
        <PrimaryButton
          key="save"
          type="submit"
          className="flex-1"
          onClick={() => formRef.current?.submitForm()}
        >
          <span className="material-symbols-outlined text-lg mr-2">save</span> {t('save')}
        </PrimaryButton>,
      ]}
    >
      <SongForm initialFormValues={songFormData} onSubmit={updateSong} ref={formRef} />
    </Aside>
  );
};

export default AsideSongForm;

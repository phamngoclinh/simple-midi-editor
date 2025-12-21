import { useMemo, useRef } from 'react';
import useImportExportSong from '../../hooks/song/useImportExportSong';
import { useSongFormInitializer } from '../../hooks/song/useSongFormInitializer';
import useUpdateSong from '../../hooks/song/useUpdateSong';
import { ChildFormHandles } from '../../utils/types';
import Aside from '../common/Aside';
import SongForm from '../song/SongForm';
import { PrimaryButton, SecondaryButton } from '../common/Button';

interface AsideSongFormProps {
  songId: string;
}

const AsideSongForm = ({ songId }: AsideSongFormProps) => {
  const { exportSong } = useImportExportSong();
  const { initializeUpdateForm } = useSongFormInitializer();
  const { updateSong } = useUpdateSong();
  const formRef = useRef<ChildFormHandles>(null);

  const songFormData = useMemo(() => {
    return initializeUpdateForm(songId);
  }, [])

  return (
    <Aside
      title='Edit song'
      subTitle='Edit song details'
      actions={[
        <SecondaryButton onClick={() => exportSong(songId)} className='flex-1'><span className='material-symbols-outlined text-lg mr-2'>arrow_downward</span> Export</SecondaryButton>,
        <PrimaryButton
          type='submit'
          className='flex-1'
          onClick={() => formRef.current?.submitForm()}
        >
          <span className='material-symbols-outlined text-lg mr-2'>save</span> Save
        </PrimaryButton>
      ]}
    >
      <SongForm
        initialFormValues={songFormData}
        onSubmit={updateSong}
        ref={formRef}
      />
    </Aside>
  )
}

export default AsideSongForm;
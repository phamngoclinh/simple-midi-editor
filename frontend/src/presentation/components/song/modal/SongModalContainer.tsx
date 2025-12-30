'use client';

import { useMemo } from 'react';
import useStudioAction from '../../../hooks/store/useStudioAction';
import CreateSongFormModal from './CreateSongFormModal';
import UpdateSongFormModal from './UpdateSongFormModal';

const SongModalContainer = () => {
  const { modal, closeCreateSongFormModal, closeUpdateSongFormModal } = useStudioAction();

  const component = useMemo(() => {
    switch (modal?.type) {
      case 'CREATE_SONG':
        return <CreateSongFormModal open={true} onClose={closeCreateSongFormModal} />;
      case 'UPDATE_SONG':
        return (
          <UpdateSongFormModal
            open={true}
            songId={(modal.data as any).songId}
            onClose={closeUpdateSongFormModal}
          />
        );
      default:
        return null;
    }
  }, [modal]);

  return <>{component}</>;
};

export default SongModalContainer;

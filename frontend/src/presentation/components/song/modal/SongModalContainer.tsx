import useStudioAction from '../../../hooks/store/useStudioAction';
import CreateSongFormModal from './CreateSongFormModal';
import UpdateSongFormModal from './UpdateSongFormModal';

const SongModalContainer = () => {
  const {
    modal,
    closeCreateSongFormModal,
    closeUpdateSongFormModal
  } = useStudioAction();

  return (
    <>
      {modal && modal.type === 'CREATE_SONG' &&
        <CreateSongFormModal
          open={true}
          onClose={closeCreateSongFormModal}
        />}
      {modal && modal.type === 'UPDATE_SONG' &&
        <UpdateSongFormModal
          open={true}
          songId={(modal.data as any).songId}
          onClose={closeUpdateSongFormModal}
        />}
    </>
  )
}

export default SongModalContainer;
import useStudioAction from '../../../hooks/store/useStudioAction';
import CreateNoteModal from './CreateNoteModal';
import NoteListModal from './NoteListModal';
import UpdateNoteModal from './UpdateNoteModal';

const NoteModalContainer = () => {
  const {
    modal,
    // openNoteListModal,
  } = useStudioAction();

  return (
    <>
      {modal && modal.type === 'VIEW_NOTES' &&
        <NoteListModal
          open={true}
          songId={(modal.data as any).songId}
        />}
      {modal && modal.type === 'CREATE_NOTE' &&
        <CreateNoteModal
          open={true}
          songId={(modal.data as any).songId}
          // onClose={openNoteListModal}
        />}
      {modal && modal.type === 'UPDATE_NOTE' &&
        <UpdateNoteModal
          open={true}
          noteId={(modal.data as any).noteId}
          // onClose={openNoteListModal}
        />}
    </>
  )
}

export default NoteModalContainer;
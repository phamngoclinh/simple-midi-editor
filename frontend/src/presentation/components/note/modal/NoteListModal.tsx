import useNoteList from '../../../hooks/note/useNoteList';
import useStudioAction from '../../../hooks/store/useStudioAction';
import Modal from '../../common/Modal';
import NoteList from '../NoteList';

interface NoteListModalProps {
  open: boolean;
  songId: string;
}

const NoteListModal = ({ open, songId }: NoteListModalProps) => {
  const { closeNoteListModal, openCreateNoteFormModal } = useStudioAction();
  const { notesBySongId: notes } = useNoteList({ songId });

  const noteIds = notes.map(n => n.id);

  return (
    <Modal
      isOpen={open}
      title='Quản lý Notes'
      textOk='Tạo note mới'
      textClose='Đóng'
      onOk={() => openCreateNoteFormModal(songId)}
      onClose={closeNoteListModal}
      >
      <NoteList noteIds={noteIds} />
    </Modal>
  )
}

export default NoteListModal;
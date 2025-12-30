import useNoteList from '../../../hooks/note/useNoteList';
import useStudioAction from '../../../hooks/store/useStudioAction';
import Modal from '../../common/Modal';
import NoteList from '../NoteList';
import { useTranslations } from 'next-intl';

interface NoteListModalProps {
  open: boolean;
  songId: string;
}

const NoteListModal = ({ open, songId }: NoteListModalProps) => {
  const { closeNoteListModal, openCreateNoteFormModal } = useStudioAction();
  const { notesBySongId: notes } = useNoteList({ songId });
  const tCommon = useTranslations('Common');
  const tNoteList = useTranslations('NoteList');

  const noteIds = notes.map(n => n.id);

  return (
    <Modal
      isOpen={open}
      title={tCommon('manageNotes')}
      textOk={tNoteList('createButton')}
      textClose={tCommon('cancel')}
      onOk={() => openCreateNoteFormModal(songId)}
      onClose={closeNoteListModal}
    >
      <NoteList noteIds={noteIds} />
    </Modal>
  );
};

export default NoteListModal;

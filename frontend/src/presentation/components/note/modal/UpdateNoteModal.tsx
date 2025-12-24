import { useCallback, useMemo, useRef } from 'react';
import { useNoteFormInitializer } from '../../../hooks/note/useNoteFormInitializer';
import useUpdateNote from '../../../hooks/note/useUpdateNote';
import useStudioAction from '../../../hooks/store/useStudioAction';
import { ChildFormHandles, NoteFormData } from '../../../utils/types';
import Modal from '../../common/Modal';
import NoteForm from '../NoteForm';

interface UpdateNoteModalProps {
  open: boolean;
  noteId: string;
  onClose?: () => void;
}

const UpdateNoteModal = ({ open, noteId, onClose }: UpdateNoteModalProps) => {
  const formRef = useRef<ChildFormHandles>(null);
  const { closeUpdateNoteFormModal } = useStudioAction();
  const { initializeUpdateForm } = useNoteFormInitializer();
  const { updateNote } = useUpdateNote();
  
  const handleClose = useCallback(() => {
    closeUpdateNoteFormModal();
    onClose?.();
  }, [closeUpdateNoteFormModal, onClose])
  
  const handleUpdate = useCallback(async (data: NoteFormData) => {
    const { success } = await updateNote(data);
    if (success) handleClose();
  }, [updateNote, handleClose]);

  const noteFormData = useMemo(() => {
    return initializeUpdateForm(noteId);
  }, [noteId, initializeUpdateForm])

  return (
    <Modal
      isOpen={open}
      title='Cập nhật note'
      textOk='Lưu note'
      textClose='Đóng'
      onOk={() => formRef.current?.submitForm()}
      onClose={handleClose}
    >
      {noteFormData
        ? <NoteForm
          initialFormValues={noteFormData}
          onSubmit={handleUpdate}
          ref={formRef}
        />
        : <>Đang khởi tạo form</>}
    </Modal>
  )
}

export default UpdateNoteModal;
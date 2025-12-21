/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback, useMemo, useRef } from 'react';
import useCreateNote from '../../../hooks/note/useCreateNote';
import { useNoteFormInitializer } from '../../../hooks/note/useNoteFormInitializer';
import useStudioAction from '../../../hooks/store/useStudioAction';
import { ChildFormHandles, NoteFormData } from '../../../utils/types';
import Modal from '../../common/Modal';
import NoteForm from '../NoteForm';

interface CreateNoteModalProps {
  open: boolean;
  songId: string;
  onClose?: () => void;
}

const CreateNoteModal = ({ open, songId, onClose }: CreateNoteModalProps) => {
  const formRef = useRef<ChildFormHandles>(null);
  const { closeCreateNoteFormModal } = useStudioAction();
  const { initializeCreateForm } = useNoteFormInitializer();
  const { createNote } = useCreateNote();
  
  const handleCreate = useCallback(async (data: NoteFormData) => {
    const { success } = await createNote(data);
    if (success) handleClose();
  }, []);

  const handleClose = useCallback(() => {
    closeCreateNoteFormModal();
    onClose?.();
  }, [])

  const noteFormData = useMemo(() => {
    return initializeCreateForm(songId);
  }, [songId, initializeCreateForm])

  return (
    <Modal
      isOpen={open}
      title='Tạo note'
      textOk='Lưu note'
      textClose='Đóng'
      onOk={() => formRef.current?.submitForm()}
      onClose={handleClose}
    >
      {noteFormData
        ? <NoteForm
          initialFormValues={noteFormData}
          onSubmit={handleCreate}
          ref={formRef}
        />
        : <>Đang khởi tạo form</>}
    </Modal>
  )
}

export default CreateNoteModal;
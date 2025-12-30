'use client';

import { useCallback, useMemo, useRef } from 'react';
import useCreateNote from '../../../hooks/note/useCreateNote';
import { useNoteFormInitializer } from '../../../hooks/note/useNoteFormInitializer';
import useStudioAction from '../../../hooks/store/useStudioAction';
import { ChildFormHandles, NoteFormData } from '../../../utils/types';
import Modal from '../../common/Modal';
import NoteForm from '../NoteForm';
import { useTranslations } from 'next-intl';

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
  const tCommon = useTranslations('Common');
  const tEditor = useTranslations('Editor');

  const handleClose = useCallback(() => {
    closeCreateNoteFormModal();
    onClose?.();
  }, [closeCreateNoteFormModal, onClose]);

  const handleCreate = useCallback(
    async (data: NoteFormData) => {
      const { success } = await createNote(data);
      if (success) handleClose();
    },
    [createNote, handleClose],
  );

  const noteFormData = useMemo(() => {
    return initializeCreateForm(songId);
  }, [songId, initializeCreateForm]);

  return (
    <Modal
      isOpen={open}
      title={tCommon('saveNote')}
      textOk={tCommon('saveNote')}
      textClose={tCommon('cancel')}
      onOk={() => formRef.current?.submitForm()}
      onClose={handleClose}
    >
      {noteFormData ? (
        <NoteForm initialFormValues={noteFormData} onSubmit={handleCreate} ref={formRef} />
      ) : (
        <>{tEditor('initializingForm')}</>
      )}
    </Modal>
  );
};

export default CreateNoteModal;

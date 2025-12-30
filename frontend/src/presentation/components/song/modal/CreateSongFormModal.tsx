'use client';

import { useCallback, useEffect, useRef } from 'react';
import useCreateSong from '../../../hooks/song/useCreateSong';
import { useSongFormInitializer } from '../../../hooks/song/useSongFormInitializer';
import useStudioAction from '../../../hooks/store/useStudioAction';
import { ChildFormHandles, SongFormData } from '../../../utils/types';
import Modal from '../../common/Modal';
import SongForm from '../SongForm';
import { useTranslations } from 'next-intl';

const CreateSongFormModal = ({ open, onClose }: { open: boolean; onClose?: () => void }) => {
  const formRef = useRef<ChildFormHandles>(null);
  const { formValues, initializeCreateForm } = useSongFormInitializer();
  const { closeCreateSongFormModal } = useStudioAction();
  const { createSong } = useCreateSong();
  const tHome = useTranslations('Home');
  const tCommon = useTranslations('Common');
  const tEditor = useTranslations('Editor');

  const handleCreate = async (data: SongFormData) => {
    const result = await createSong(data);
    if (result.success) handleClose();
  };

  const handleClose = useCallback(() => {
    closeCreateSongFormModal();
    onClose?.();
  }, [closeCreateSongFormModal, onClose]);

  useEffect(() => {
    if (open) initializeCreateForm();
  }, [open, initializeCreateForm]);

  return (
    <Modal
      isOpen={open}
      onClose={handleClose}
      title={tHome('createButton')}
      textOk={tCommon('saveSong')}
      onOk={() => formRef.current?.submitForm()}
    >
      {formValues ? (
        <SongForm initialFormValues={formValues} onSubmit={handleCreate} ref={formRef} />
      ) : (
        <span>{tEditor('initializingForm')}</span>
      )}
    </Modal>
  );
};

export default CreateSongFormModal;

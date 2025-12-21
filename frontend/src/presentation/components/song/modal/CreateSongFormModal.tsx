/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback, useEffect, useRef } from 'react';
import useCreateSong from '../../../hooks/song/useCreateSong';
import { useSongFormInitializer } from '../../../hooks/song/useSongFormInitializer';
import useStudioAction from '../../../hooks/store/useStudioAction';
import { ChildFormHandles, SongFormData } from '../../../utils/types';
import Modal from '../../common/Modal';
import SongForm from '../SongForm';

const CreateSongFormModal = ({ open, onClose }: { open: boolean, onClose?: () => void; }) => {
  const formRef = useRef<ChildFormHandles>(null);
  const { formValues, initializeCreateForm } = useSongFormInitializer();
  const { closeCreateSongFormModal } = useStudioAction();
  const { createSong } = useCreateSong();

  const handleCreate = async (data: SongFormData) => {
    const result = await createSong(data);
    if (result.success) handleClose();
  }

  const handleClose = useCallback(() => {
    closeCreateSongFormModal();
    onClose?.();
  }, [])

  useEffect(() => {
    if (open) initializeCreateForm();
  }, [open])

  return (
    <Modal
      isOpen={open}
      onClose={handleClose}
      title='Tạo bài hát mới'
      textOk='Lưu bài hát'
      onOk={() => formRef.current?.submitForm()}
    >
      {formValues
        ? <SongForm initialFormValues={formValues} onSubmit={handleCreate} ref={formRef} />
        : <span>Đang khởi tạo Form</span>}
    </Modal>
  )
}

export default CreateSongFormModal;
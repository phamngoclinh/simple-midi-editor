import { useCallback, useMemo, useRef } from 'react';
import { useSongFormInitializer } from '../../../hooks/song/useSongFormInitializer';
import useUpdateSong from '../../../hooks/song/useUpdateSong';
import useStudioAction from '../../../hooks/store/useStudioAction';
import { ChildFormHandles, SongFormData } from '../../../utils/types';
import Modal from '../../common/Modal';
import SongForm from '../SongForm';

const UpdateSongFormModal = ({ songId, open, onClose }: { songId: string; open: boolean, onClose?: () => void; }) => {
  const formRef = useRef<ChildFormHandles>(null);
  const { initializeUpdateForm } = useSongFormInitializer();
  const { closeUpdateSongFormModal } = useStudioAction();
  const { updateSong } = useUpdateSong();

  const handleUpdate = async (data: SongFormData) => {
    const result = await updateSong(data);
    if (result.success) handleClose();
  }

  const handleClose = useCallback(() => {
    closeUpdateSongFormModal();
    onClose?.();
  }, [closeUpdateSongFormModal, onClose])

  const songFormData = useMemo(() => {
    return initializeUpdateForm(songId);
  }, [songId, initializeUpdateForm])

  return (
    <Modal
      isOpen={open}
      onClose={handleClose}
      title='Cập nhật bài hát'
      textOk='Lưu bài hát'
      onOk={() => formRef.current?.submitForm()}
    >
      {songFormData
        ? <SongForm initialFormValues={songFormData} onSubmit={handleUpdate} ref={formRef} />
        : <span>Đang khởi tạo Form</span>}
    </Modal>
  )
}

export default UpdateSongFormModal;
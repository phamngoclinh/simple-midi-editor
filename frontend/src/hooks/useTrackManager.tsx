import { useCallback } from "react";
import { useModal } from "../contexts/ModalContext";
import { editTrackLabelUseCase } from "../dependencies";

const useTrackManager = () => {
  const { showToast } = useModal();

  const editTrackLabel = useCallback(async (songId: string, trackId: string, newLabel: string, onUpdate?: () => void) => {
    if (!songId || !trackId || !newLabel) return;

    console.log(`Đang cố gắng cập nhật Track ID ${trackId} với Label: "${newLabel}"`);

    try {
      await editTrackLabelUseCase.execute({
        songId: songId,
        trackId: trackId,
        newLabel: newLabel
      });
      onUpdate?.();
    } catch (error) {
      console.error("Lỗi khi cập nhật Track Label:", error);
      showToast({
        type: 'error',
        message: "Cập nhật nhãn Track thất bại."
      });
    }

  }, [showToast]);

  return {
    editTrackLabel
  }
}

export default useTrackManager;
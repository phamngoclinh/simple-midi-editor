'use client';

import { deleteSongUseCase } from '../../../dependencies';
import { useSongsState, useStudioDispatch } from '../../../infrastructure/stores/studio';
import { toResult } from '../../utils/helper';
import useModalAction from '../store/useModalAction';
import { useUseCase } from '../useUseCase';
import { useTranslations } from 'next-intl';

const useDeleteSong = () => {
  const dispatch = useStudioDispatch();
  const { songs } = useSongsState();
  const { showConfirmation } = useModalAction();
  const { call } = useUseCase();
  const tNotification = useTranslations('Notification');
  const tConfirmation = useTranslations('Confirmation');

  const deleteSong = async (songId: string) => {
    const song = songs[songId];
    if (!song) return toResult.failure<{ id: string }>();
    const confirmed = await showConfirmation({
      message: tConfirmation('deleteSongMessage'),
      title: tConfirmation('deleteSongTitle'),
      confirmButtonLabel: tConfirmation('deleteSongAction'),
    });
    if (!confirmed) return toResult.failure<{ id: string }>();
    const messages = {
      success: tNotification('deleteSongSuccess'),
      error: tNotification('deleteSongFailure'),
    };
    const response = await call(async () => await deleteSongUseCase.execute(songId), messages);
    if (!response.success) return toResult.failure<{ id: string }>();
    dispatch({ type: 'DELETE_SONG', payload: { songId } });
    return toResult.success<{ id: string }>({ id: songId });
  };

  return {
    deleteSong,
  };
};

export default useDeleteSong;

import { deleteSongUseCase } from '../../../dependencies';
import { useSongsState, useStudioDispatch } from '../../../infrastructure/stores/studio';
import { CONFIRMATIONS, MESSAGES } from '../../utils/contents';
import { toResult } from '../../utils/helper';
import useModalAction from '../store/useModalAction';
import { useUseCase } from '../useUseCase';

const useDeleteSong = () => {
  const dispatch = useStudioDispatch();
  const { songs } = useSongsState()
  const { showConfirmation } = useModalAction();
  const { call } = useUseCase();

  const deleteSong = async (songId: string) => {
    const song = songs[songId];
    if (!song) return toResult.failure<{ id: string }>();
    const confirmed = await showConfirmation({
      message: CONFIRMATIONS.DELETE_SONG_MESSAGE,
      title: CONFIRMATIONS.DELETE_SONG_TITLE,
      confirmButtonLabel: CONFIRMATIONS.DELETE_SONG_ACTION,
    });
    if (!confirmed) return toResult.failure<{ id: string }>();
    const messages = {
      success: MESSAGES.DELETE_SONG_SUCCESS,
      error: MESSAGES.DELETE_SONG_FAILURE,
    }
    const response = await call(async () => await deleteSongUseCase.execute(songId), messages);
    if (!response.success) return toResult.failure<{ id: string }>();
    dispatch({ type: 'DELETE_SONG', payload: { songId } });
    return toResult.success<{ id: string }>({ id: songId });
  };

  return {
    deleteSong
  };
}

export default useDeleteSong;
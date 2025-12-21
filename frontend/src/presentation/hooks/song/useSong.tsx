import { useCallback } from 'react';
import { loadSongByIdUseCase } from '../../../dependencies';
import { useSongSelector, useStudioDispatch, useStudioSelector } from '../../../infrastructure/stores/studio';
import { MESSAGES } from '../../utils/contents';
import { useUseCase } from '../useUseCase';
import { storeSongMapper } from '../store/mapper';

const useSong = ({ id }: { id: string }) => {
  const dispatch = useStudioDispatch();
  const { song, tracks, notes } = useSongSelector(id);
  const loading = useStudioSelector(state => state.uiState.isLoadingSong);
  const { call } = useUseCase();

  const loadSong = useCallback(async (songId: string) => {
    dispatch({ type: 'LOADING_SONG' })
    const messages = { error: MESSAGES.READ_SONG_FAILURE }
    const response = await call(async () => await loadSongByIdUseCase.execute(songId), messages);
    if (!response.success) {
      dispatch({ type: 'LOADED_SONG' })
      return;
    }
    dispatch({ type: 'CREATE_SONG', payload: storeSongMapper.toSongChangePayload(response.data) })
    dispatch({ type: 'LOADED_SONG' })
  }, [dispatch, call]);

  return {
    loading,
    song,
    tracks,
    notes,
    loadSong,
  };
}

export default useSong;
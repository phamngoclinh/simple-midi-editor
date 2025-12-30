import { useCallback } from 'react';
import SongAggregate from '../../../domain/songAggregate/songAggregate';
import { loadSongByIdUseCase } from '../../../dependencies';
import {
  useSongSelector,
  useStudioDispatch,
  useStudioSelector,
} from '../../../infrastructure/stores/studio';
import { useUseCase } from '../useUseCase';
import { storeSongMapper } from '../store/mapper';
import { useTranslations } from 'next-intl';

const useSong = ({ id }: { id: string }) => {
  const dispatch = useStudioDispatch();
  const { song, tracks, notes } = useSongSelector(id);
  const loading = useStudioSelector(state => state.uiState.isLoadingSong);
  const { call } = useUseCase();
  const t = useTranslations('Notification');

  const loadSong = useCallback(
    async (songId: string) => {
      dispatch({ type: 'LOADING_SONG' });
      const messages = { error: t('readSongFailure') };
      const response = await call(async () => await loadSongByIdUseCase.execute(songId), messages);
      if (!response.success) {
        dispatch({ type: 'LOADED_SONG' });
        return;
      }
      dispatch({
        type: 'CREATE_SONG',
        payload: storeSongMapper.toSongChangePayload(response.data),
      });
      dispatch({ type: 'LOADED_SONG' });
    },
    [dispatch, call],
  );

  const setInitialSong = useCallback(
    (songAggregate: SongAggregate) => {
      const payload = storeSongMapper.toSongChangePayload(songAggregate);
      dispatch({ type: 'CREATE_SONG', payload });
      dispatch({ type: 'LOADED_SONG' });
    },
    [dispatch],
  );

  return {
    loading,
    song,
    tracks,
    notes,
    loadSong,
    setInitialSong,
  };
};

export default useSong;

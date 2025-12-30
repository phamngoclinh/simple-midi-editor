import { useCallback, useMemo } from 'react';
import { listAllSongsUseCase } from '../../../dependencies';
import SongAggregate from '../../../domain/songAggregate/songAggregate';
import {
  SongChangePayload,
  useSongsState,
  useStudioDispatch,
  useStudioSelector,
} from '../../../infrastructure/stores/studio';
import { useUseCase } from '../useUseCase';
import { storeSongMapper } from '../store/mapper';
import { useTranslations } from 'next-intl';

const useSongList = () => {
  const dispatch = useStudioDispatch();
  const { songs, notes, tracks } = useSongsState();
  const loading = useStudioSelector(state => state.uiState.isLoadingSongs);
  const { call } = useUseCase();
  const t = useTranslations('Notification');

  const loadSongs = useCallback(async () => {
    dispatch({ type: 'LOADING_SONGS' });
    const messages = { error: t('readSongsFailure') };
    const response = await call<SongAggregate[]>(
      async () => await listAllSongsUseCase.execute({ sortBy: 'created', order: 'asc' }),
      messages,
    );
    if (!response.success) {
      dispatch({ type: 'LOADED_SONGS' });
      return;
    }
    const songResult: SongChangePayload[] = response.data.map(storeSongMapper.toSongChangePayload);
    dispatch({ type: 'CREATE_SONGS', payload: songResult });
    dispatch({ type: 'LOADED_SONGS' });
  }, [dispatch, call, t]);

  const setInitialSongs = useCallback(
    (songAggregates: SongAggregate[]) => {
      const songResult: SongChangePayload[] = songAggregates.map(
        storeSongMapper.toSongChangePayload,
      );
      dispatch({ type: 'CREATE_SONGS', payload: songResult });
      dispatch({ type: 'LOADED_SONGS' });
    },
    [dispatch],
  );

  const ids = useMemo(() => {
    return Object.keys(songs);
  }, [songs]);

  return {
    loading,
    loadSongs,
    setInitialSongs,
    notes,
    songs,
    tracks,
    ids,
  };
};

export default useSongList;

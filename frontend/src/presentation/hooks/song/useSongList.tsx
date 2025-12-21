import { useCallback, useMemo } from 'react';
import { listAllSongsUseCase } from '../../../dependencies';
import SongAggregate from '../../../domain/songAggregate/songAggregate';
import { SongChangePayload, useSongsState, useStudioDispatch, useStudioSelector } from '../../../infrastructure/stores/studio';
import { MESSAGES } from '../../utils/contents';
import { useUseCase } from '../useUseCase';
import { storeSongMapper } from '../store/mapper';

const useSongList = () => {
  const dispatch = useStudioDispatch();
  const { songs, notes, tracks } = useSongsState();
  const loading = useStudioSelector(state => state.uiState.isLoadingSongs);
  const { call } = useUseCase();

  const loadSongs = useCallback(async () => {
    dispatch({ type: 'LOADING_SONGS' })
    const messages = { error: MESSAGES.READ_SONGS_FAILURE }
    const response = await call<SongAggregate[]>(async () => await listAllSongsUseCase.execute({ sortBy: 'created', order: 'asc' }), messages);
    if (!response.success) {
      dispatch({ type: 'LOADED_SONGS' })
      return;
    }
    const songResult: SongChangePayload[] = response.data.map(storeSongMapper.toSongChangePayload);
    dispatch({ type: 'CREATE_SONGS', payload: songResult })
    dispatch({ type: 'LOADED_SONGS' })
  }, [dispatch, call]);

  const ids = useMemo(() => {
    return Object.keys(songs);
  }, [songs])

  return {
    loading,
    loadSongs,
    notes,
    songs,
    tracks,
    ids,
  };
}

export default useSongList;
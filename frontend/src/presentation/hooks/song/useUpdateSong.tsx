import { useCallback } from 'react';
import { ValidationError } from '../../../application/shared/result';
import { UpdateSongInput } from '../../../application/usecases/songAggregate/dto/updateSongInput';
import { updateSongUseCase } from '../../../dependencies';
import { useStudioDispatch } from '../../../infrastructure/stores/studio';
import { MESSAGES } from '../../utils/contents';
import { toResult } from '../../utils/helper';
import { SongFormData } from '../../utils/types';
import { useUseCase } from '../useUseCase';
import { storeSongMapper } from '../store/mapper';

const useUpdateSong = () => {
  const dispatch = useStudioDispatch();
  const { call } = useUseCase();
  
  const map = useCallback((songToUpdate: SongFormData) => {
    const createData: UpdateSongInput = {
      id: songToUpdate.id,
      name: songToUpdate.name,
      description: songToUpdate.description,
      totalDuration: songToUpdate.totalDuration,
      tags: songToUpdate.tags,
      tracks: songToUpdate.tracks.map(t => ({
        id: t.id,
        label: t.label,
        order: t.order,
        instrument: t.instrument,
        notes: t.notes?.map(n => ({
          id: n.id,
          time: n.time,
          title: n.title,
          description: n.description,
          color: n.color,
          icon: n.icon,
        })) || [],
      })),
    };
    return createData;
  }, [])

  const updateSong = async (songToUpdate: SongFormData) => {
    const updateData = map(songToUpdate);
    const messages = {
      success: MESSAGES.UPDATE_SONG_SUCCESS,
      error: MESSAGES.UPDATE_SONG_FAILURE,
    }
    const response = await call(async () => await updateSongUseCase.execute(updateData), messages);
    if (!response.success) {
      return toResult.failure<void, ValidationError>(response.errors);
    }
    const songResult = storeSongMapper.toSongChangePayload(response.data);
    dispatch({ type: 'UPDATE_SONG', payload: songResult });
    return toResult.success(songResult);
  };

  return {
    updateSong,
  };
}

export default useUpdateSong;
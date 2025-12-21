import { useCallback } from 'react';
import { ValidationError } from '../../../application/shared/result';
import { CreateSongInput } from '../../../application/usecases/songAggregate/dto/createSongInput';
import { createSongUseCase } from '../../../dependencies';
import { useStudioDispatch } from '../../../infrastructure/stores/studio';
import { MESSAGES } from '../../utils/contents';
import { toResult } from '../../utils/helper';
import { SongFormData } from '../../utils/types';
import { useUseCase } from '../useUseCase';
import { storeSongMapper } from '../store/mapper';

const useCreateSong = () => {
  const dispatch = useStudioDispatch();
  const { call } = useUseCase();

  const map = useCallback((songToCreate: SongFormData) => {
    const createData: CreateSongInput = {
      name: songToCreate.name,
      description: songToCreate.description,
      totalDuration: songToCreate.totalDuration,
      tags: songToCreate.tags,
      tracks: songToCreate.tracks.map(t => ({
        label: t.label,
        order: t.order,
        instrument: t.instrument,
        notes: t.notes?.map(n => ({
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

  const createSong = async (songToCreate: SongFormData) => {
    const createData = map(songToCreate);
    const messages = {
      success: MESSAGES.CREATE_SONG_SUCCESS,
      error: MESSAGES.CREATE_SONG_FAILURE,
    }
    const response = await call(async () => await createSongUseCase.execute(createData), messages);
    if (!response.success) {
      return toResult.failure<void, ValidationError>(response.errors);
    }
    const songResult = storeSongMapper.toSongChangePayload(response.data);
    dispatch({ type: 'CREATE_SONG', payload: songResult });
    return toResult.success(songResult);
  };

  return {
    createSong,
  };
}

export default useCreateSong;
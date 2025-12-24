import { useCallback } from 'react';
import { createNoteUseCase } from '../../../dependencies';
import { useStudioDispatch } from '../../../infrastructure/stores/studio';
import { MESSAGES } from '../../utils/contents';
import { toResult } from '../../utils/helper';
import { NoteFormData } from '../../utils/types';
import { useUseCase } from '../useUseCase';
import NoteEntity from '../../../domain/note/noteEntity';
import { ValidationError } from '../../../application/shared/result';

const useCreateNote = () => {
  const dispatch = useStudioDispatch();
  const { call } = useUseCase();

  const map = useCallback((data: NoteFormData) => {
    return {
      songId: data.songId,
      trackId: data.trackId,
      title: data.title,
      description: data.description,
      time: data.time,
      color: data.color,
      icon: data.icon,
    }
  }, [])

  const createNote = useCallback(async (data: NoteFormData) => {
    const messages = {
      success: MESSAGES.SAVE_NOTE_SUCCESS,
      error: MESSAGES.SAVE_NOTE_FAILURE,
    }
    const response = await call(async () => await createNoteUseCase.execute(map(data)), messages);
    if (!response.success) {
      return toResult.failure<NoteEntity, ValidationError>(response.errors);
    }
    dispatch({
      type: 'CREATE_NOTE',
      payload: response.data
    })
    return toResult.success<NoteEntity>(response.data);
  }, [map, call, dispatch]);

  return {
    createNote
  };
}

export default useCreateNote;
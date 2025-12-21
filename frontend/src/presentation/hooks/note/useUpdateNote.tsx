import { useCallback } from 'react';
import { updateNoteUseCase } from '../../../dependencies';
import { useStudioDispatch } from '../../../infrastructure/stores/studio';
import { MESSAGES } from '../../utils/contents';
import { toResult } from '../../utils/helper';
import { NoteFormData } from '../../utils/types';
import { useUseCase } from '../useUseCase';
import NoteEntity from '../../../domain/note/noteEntity';
import { ValidationError } from '../../../application/shared/result';

const useUpdateNote = () => {
  const dispatch = useStudioDispatch();
  const { call } = useUseCase();

  const map = useCallback((data: NoteFormData) => {
    return {
      id: data.id,
      title: data.title,
      description: data.description,
      time: data.time,
      color: data.color,
      icon: data.icon,
      trackId: data.trackId
    }
  }, [])

  const updateNote = useCallback(async (data: NoteFormData) => {
    const messages = {
      success: MESSAGES.SAVE_NOTE_SUCCESS,
      error: MESSAGES.SAVE_NOTE_FAILURE,
    }
    const response = await call(async () => await updateNoteUseCase.execute(map(data)), messages);
    if (!response.success) {
      return toResult.failure<NoteEntity, ValidationError>(response.errors);
    }
    dispatch({
      type: 'UPDATE_NOTE',
      payload: {
        ...response.data,
      }
    })
    return toResult.success<NoteEntity>(response.data);
  }, [dispatch, call, map]);

  return {
    updateNote
  };
}

export default useUpdateNote;
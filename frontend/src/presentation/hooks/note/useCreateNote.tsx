import { useCallback } from 'react';
import { createNoteUseCase } from '../../../dependencies';
import { useStudioDispatch } from '../../../infrastructure/stores/studio';
import { toResult } from '../../utils/helper';
import { NoteFormData } from '../../utils/types';
import { useUseCase } from '../useUseCase';
import NoteEntity from '../../../domain/note/noteEntity';
import { ValidationError } from '../../../application/shared/result';
import { useTranslations } from 'next-intl';

const useCreateNote = () => {
  const dispatch = useStudioDispatch();
  const { call } = useUseCase();
  const t = useTranslations('Notification');

  const map = useCallback((data: NoteFormData) => {
    return {
      songId: data.songId,
      trackId: data.trackId,
      title: data.title,
      description: data.description,
      time: data.time,
      color: data.color,
      icon: data.icon,
    };
  }, []);

  const createNote = useCallback(
    async (data: NoteFormData) => {
      const messages = {
        success: t('saveNoteSuccess'),
        error: t('saveNoteFailure'),
      };
      const response = await call(async () => await createNoteUseCase.execute(map(data)), messages);
      if (!response.success) {
        return toResult.failure<NoteEntity, ValidationError>(response.errors);
      }
      dispatch({
        type: 'CREATE_NOTE',
        payload: response.data,
      });
      return toResult.success<NoteEntity>(response.data);
    },
    [map, call, dispatch, t],
  );

  return {
    createNote,
  };
};

export default useCreateNote;

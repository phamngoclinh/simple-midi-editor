import { useCallback } from 'react';
import { updateNoteUseCase } from '../../../dependencies';
import { useStudioDispatch } from '../../../infrastructure/stores/studio';
import { toResult } from '../../utils/helper';
import { NoteFormData } from '../../utils/types';
import { useUseCase } from '../useUseCase';
import NoteEntity from '../../../domain/note/noteEntity';
import { ValidationError } from '../../../application/shared/result';
import { useTranslations } from 'next-intl';

const useUpdateNote = () => {
  const dispatch = useStudioDispatch();
  const { call } = useUseCase();
  const t = useTranslations('Notification');

  const map = useCallback((data: NoteFormData) => {
    return {
      id: data.id,
      title: data.title,
      description: data.description,
      time: data.time,
      color: data.color,
      icon: data.icon,
      trackId: data.trackId,
    };
  }, []);

  const updateNote = useCallback(
    async (data: NoteFormData) => {
      const messages = {
        success: t('saveNoteSuccess'),
        error: t('saveNoteFailure'),
      };
      const response = await call(async () => await updateNoteUseCase.execute(map(data)), messages);
      if (!response.success) {
        return toResult.failure<NoteEntity, ValidationError>(response.errors);
      }
      dispatch({
        type: 'UPDATE_NOTE',
        payload: {
          ...response.data,
        },
      });
      return toResult.success<NoteEntity>(response.data);
    },
    [dispatch, call, map, t],
  );

  return {
    updateNote,
  };
};

export default useUpdateNote;

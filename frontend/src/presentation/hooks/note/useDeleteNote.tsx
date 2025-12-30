'use client';

import { useCallback } from 'react';
import { deleteNoteUseCase } from '../../../dependencies';
import { useStudioDispatch } from '../../../infrastructure/stores/studio';
import { toResult } from '../../utils/helper';
import useModalAction from '../store/useModalAction';
import { useUseCase } from '../useUseCase';
import { useTranslations } from 'next-intl';

const useDeleteNote = () => {
  const dispatch = useStudioDispatch();
  const { showConfirmation } = useModalAction();
  const { call } = useUseCase();
  const tNotification = useTranslations('Notification');
  const tConfirmation = useTranslations('Confirmation');

  const deleteNote = useCallback(
    async (noteId: string) => {
      const confirmed = await showConfirmation({
        message: tConfirmation('deleteNoteMessage'),
        title: tConfirmation('deleteNoteTitle'),
        confirmButtonLabel: tConfirmation('deleteNoteAction'),
      });
      if (!confirmed) return toResult.failure<boolean>();
      const messages = {
        success: tNotification('deleteNoteSuccess'),
        error: tNotification('deleteNoteFailure'),
      };
      const response = await call(async () => await deleteNoteUseCase.execute(noteId), messages);
      if (!response.success) return toResult.failure<boolean>();
      dispatch({ type: 'DELETE_NOTE', payload: { noteId } });
      return toResult.success<boolean>(true);
    },
    [call, dispatch, showConfirmation, tConfirmation, tNotification],
  );

  return {
    deleteNote,
  };
};

export default useDeleteNote;

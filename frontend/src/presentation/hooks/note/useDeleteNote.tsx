import { useCallback } from 'react';
import { deleteNoteUseCase } from '../../../dependencies';
import { useStudioDispatch } from '../../../infrastructure/stores/studio';
import { CONFIRMATIONS, MESSAGES } from '../../utils/contents';
import { toResult } from '../../utils/helper';
import useModalAction from '../store/useModalAction';
import { useUseCase } from '../useUseCase';

const useDeleteNote = () => {
  const dispatch = useStudioDispatch();
  const { showConfirmation } = useModalAction();
  const { call } = useUseCase();

  const deleteNote = useCallback(async (noteId: string) => {
    const confirmed = await showConfirmation({
      message: CONFIRMATIONS.DELETE_NOTE_MESSAGE,
      title: CONFIRMATIONS.DELETE_NOTE_TITLE,
      confirmButtonLabel: CONFIRMATIONS.DELETE_NOTE_ACTION,
    });
    if (!confirmed) return toResult.failure<boolean>();
    const messages = {
      success: MESSAGES.DELETE_NOTE_SUCCESS,
      error: MESSAGES.DELETE_NOTE_FAILURE,
    }
    const response = await call(async () => await deleteNoteUseCase.execute(noteId), messages);
    if (!response.success) return toResult.failure<boolean>();
    dispatch({ type: 'DELETE_NOTE', payload: { noteId } })
    return toResult.success<boolean>(true);
  }, [call, dispatch, showConfirmation]);

  return {
    deleteNote
  };
}

export default useDeleteNote;
import { useCallback } from 'react';
import { useStudioDispatch, useStudioSelector } from '../../../infrastructure/stores/studio';

const useStudioAction = () => {
  const dispatch = useStudioDispatch();
  const uiState = useStudioSelector(state => state.uiState);

  const openCreateSongFormModal = useCallback(() => {
    dispatch({ type: 'OPEN_MODAL', payload: { type: 'CREATE_SONG', data: {} } });
  }, [dispatch]);

  const closeCreateSongFormModal = useCallback(() => {
    dispatch({ type: 'CLOSE_MODAL', payload: { type: 'CREATE_SONG' } });
  }, [dispatch]);

  const openUpdateSongFormModal = useCallback((songId: string) => {
    dispatch({ type: 'OPEN_MODAL', payload: { type: 'UPDATE_SONG', data: { songId } } });
  }, [dispatch]);

  const closeUpdateSongFormModal = useCallback(() => {
    dispatch({ type: 'CLOSE_MODAL', payload: { type: 'UPDATE_SONG' } });
  }, [dispatch]);

  const openNoteListModal = useCallback((songId: string) => {
    dispatch({ type: 'OPEN_MODAL', payload: { type: 'VIEW_NOTES', data: { songId } } });
  }, [dispatch]);

  const closeNoteListModal = useCallback(() => {
    dispatch({ type: 'CLOSE_MODAL', payload: { type: 'VIEW_NOTES' } });
  }, [dispatch]);

  const openCreateNoteFormModal = useCallback((songId: string) => {
    dispatch({ type: 'OPEN_MODAL', payload: { type: 'CREATE_NOTE', data: { songId } } });
  }, [dispatch]);

  const closeCreateNoteFormModal = useCallback(() => {
    dispatch({ type: 'CLOSE_MODAL', payload: { type: 'CREATE_NOTE' } });
  }, [dispatch]);

  const openUpdateNoteFormModal = useCallback((noteId: string) => {
    dispatch({ type: 'OPEN_MODAL', payload: { type: 'UPDATE_NOTE', data: { noteId } } });
  }, [dispatch]);

  const closeUpdateNoteFormModal = useCallback(() => {
    dispatch({ type: 'CLOSE_MODAL', payload: { type: 'UPDATE_NOTE' } });
  }, [dispatch]);

  return {
    ...uiState,
    openCreateSongFormModal,
    closeCreateSongFormModal,
    openUpdateSongFormModal,
    closeUpdateSongFormModal,
    openNoteListModal,
    closeNoteListModal,
    openCreateNoteFormModal,
    closeCreateNoteFormModal,
    openUpdateNoteFormModal,
    closeUpdateNoteFormModal,
  };
};

export default useStudioAction;

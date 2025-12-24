import { useCallback } from 'react';
import { useStudioDispatch, useStudioSelector } from '../../../infrastructure/stores/studio';

const useStudioAction = () => {
  const dispatch = useStudioDispatch();
  const uiState = useStudioSelector(state => state.uiState)

  const openCreateSongFormModal = useCallback(() => {
    dispatch({ type: 'OPEN_MODAL', payload: { type: 'CREATE_SONG', data: {} } })
  }, [])

  const closeCreateSongFormModal = useCallback(() => {
    dispatch({ type: 'CLOSE_MODAL', payload: { type: 'CREATE_SONG' } })
  }, [])

  const openUpdateSongFormModal = useCallback((songId: string) => {
    dispatch({ type: 'OPEN_MODAL', payload: { type: 'UPDATE_SONG', data: { songId } } })
  }, [])

  const closeUpdateSongFormModal = useCallback(() => {
    dispatch({ type: 'CLOSE_MODAL', payload: { type: 'UPDATE_SONG' } })
  }, [])
  
  const openNoteListModal = useCallback((songId: string) => {
    dispatch({ type: 'OPEN_MODAL', payload: { type: 'VIEW_NOTES', data: { songId } } })
  }, [])

  const closeNoteListModal = useCallback(() => {
    dispatch({ type: 'CLOSE_MODAL', payload: { type: 'VIEW_NOTES' } })
  }, [])
  
  const openCreateNoteFormModal = useCallback((songId: string) => {
    dispatch({ type: 'OPEN_MODAL', payload: { type: 'CREATE_NOTE', data: { songId } } })
  }, [])

  const closeCreateNoteFormModal = useCallback(() => {
    dispatch({ type: 'CLOSE_MODAL', payload: { type: 'CREATE_NOTE' } })
  }, [])
  
  const openUpdateNoteFormModal = useCallback((noteId: string) => {
    dispatch({ type: 'OPEN_MODAL', payload: { type: 'UPDATE_NOTE', data: { noteId } } })
  }, [])

  const closeUpdateNoteFormModal = useCallback(() => {
    dispatch({ type: 'CLOSE_MODAL', payload: { type: 'UPDATE_NOTE' } })
  }, [])

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
}

export default useStudioAction;
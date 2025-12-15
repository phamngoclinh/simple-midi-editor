import { useCallback, useMemo, useState } from 'react';
import { useModal } from '../contexts/ModalContext';
import {
  addNoteToSongUseCase,
  deleteExistingNoteUseCase,
  editExistingNoteUseCase
} from '../dependencies';
import { Note } from '../domain/entities/Note';
import { NoteTriggerAction } from '../utils/types';

interface NoteFormData {
  songId: string;
  trackId: string;
  track: number;
  time: number;
  title: string;
  description: string;
  color: string;
  icon?: string;
}

export default function useNotesManager(onAfterChange?: (note: Note, action: NoteTriggerAction) => Promise<void>) {
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [isOpenEditNotes, setIsOpenEditNotes] = useState<boolean>(false);

  const { showToast, showConfirmation } = useModal();

  const startEditNote = useCallback((note: Note | null) => {
    setEditingNote(note);
  }, [])

  const stopEditNote = useCallback(() => setEditingNote(null), [])
  
  const startEditNotes = useCallback(() => { setIsOpenEditNotes(true) }, [])

  const stopEditNotes = useCallback(() => { setIsOpenEditNotes(false) }, [])

  const saveNote = useCallback(async (noteData: NoteFormData) => {
    try {
      const update = editingNote && editingNote.id;
      let savedNote: Note | null = null;
      if (update) {
        savedNote= await editExistingNoteUseCase.execute({ id: editingNote.id as string, ...noteData });
      } else {
        savedNote = await addNoteToSongUseCase.execute({ ...noteData });
      }
      const noteId = savedNote.id;
      showToast({
        type: 'success',
        message: 'Note đã được lưu thành công.',
      });
      if (onAfterChange) await onAfterChange(
        { ...noteData, id: noteId },
        update ? 'update' : 'create'
      );
      setEditingNote(null);
      return true;
    } catch (err: any) {
      console.error('Lỗi khi lưu Note:', err);
      showToast({
        type: 'error',
        message: 'Lưu Note thất bại',
        extraMessage: err?.message
      });
      return false;
    }
  }, [editingNote, onAfterChange, showToast]);

  const deleteNote = useCallback(async (noteId: string) => {
    const confirmed = await showConfirmation({
      message: 'Bạn có chắc chắn muốn xóa Note này không?',
      title: "Xác nhận Xóa",
      confirmButtonLabel: "XÓA VĨNH VIỄN",
    });
    if (!confirmed) return false;
    try {
      await deleteExistingNoteUseCase.execute(noteId);
      showToast({
        type: 'success',
        message: 'Note đã được xóa.',
      });
      if (onAfterChange) await onAfterChange({ id: noteId } as Note, 'delete');
      setEditingNote(null);
      return true;
    } catch (err: any) {
      console.error('Lỗi khi xóa Note:', err);
      showToast({
        type: 'error',
        message: 'Xóa Note thất bại',
        extraMessage: err?.message
      });
      return false
    }
  }, [onAfterChange, showToast, showConfirmation]);

  const resetNotes = useCallback(() => {
    setEditingNote(null);
    setIsOpenEditNotes(false);
  }, []);

  const initialNote = useMemo(() => {
    return editingNote ? {
      id: editingNote.id,
      songId: editingNote.songId as string,
      trackId: editingNote.trackId as string,
      track: editingNote.track,
      time: editingNote.time,
      title: editingNote.title || '',
      description: editingNote.description || '',
      color: editingNote.color || '#007bff',
      icon: editingNote.icon || 'none',
    } : null
  }, [editingNote])

  return {
    editingNote,
    isOpenEditNotes,
    startEditNote,
    stopEditNote,
    startEditNotes,
    stopEditNotes,
    saveNote,
    deleteNote,
    resetNotes,
    initialNote,
  };
}
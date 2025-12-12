import { useCallback, useMemo, useState } from 'react';
import { useModal } from '../contexts/ModalContext';
import {
  addNoteToSongUseCase,
  deleteExistingNoteUseCase,
  editExistingNoteUseCase
} from '../dependencies';
import { Note } from '../domain/entities/Note';
import { Song } from '../domain/entities/Song';

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

export default function useNotesManager(onAfterChange?: () => Promise<void>, song?: Song) {
  const [selectedSongForNoteEdit, setSelectedSongForNoteEdit] = useState<Song | null>(song || null);
  const [editingNote, setEditingNote] = useState<Note | null>(null);

  const { showToast, showConfirmation } = useModal();

  const startNoteManagement = useCallback((song: Song | null) => {
    setSelectedSongForNoteEdit(song);
    setEditingNote(null);
  }, []);

  const startEditNote = useCallback((note: Note | null) => {
    setEditingNote(note);
  }, [])

  const stopEditNote = useCallback(() => setEditingNote(null), [])

  const saveNote = useCallback(async (noteData: NoteFormData) => {
    if (!selectedSongForNoteEdit) return;
    try {
      if (editingNote && editingNote.id) {
        await editExistingNoteUseCase.execute({ id: editingNote.id as string, ...noteData });
      } else {
        await addNoteToSongUseCase.execute({ ...noteData });
      }
      showToast({
        type: 'success',
        message: 'Note đã được lưu thành công.',
      });
      setEditingNote(null);
      if (onAfterChange) await onAfterChange();
    } catch (err: any) {
      console.error('Lỗi khi lưu Note:', err);
      showToast({
        type: 'error',
        message: 'Lưu Note thất bại. ' + (err?.message || ''),
      });
    }
  }, [selectedSongForNoteEdit, editingNote, onAfterChange, showToast]);

  const deleteNote = useCallback(async (noteId: string) => {
    if (!selectedSongForNoteEdit) return;
    const confirmed = await showConfirmation({
      message: 'Bạn có chắc chắn muốn xóa Note này không?',
      title: "Xác nhận Xóa",
      confirmButtonLabel: "XÓA VĨNH VIỄN",
    });
    if (confirmed) {
      try {
        const trackId = selectedSongForNoteEdit.tracks.find(t => t.notes.some(n => n.id === noteId))?.id;
        if (!trackId) throw new Error('Track ID không tìm thấy');
        await deleteExistingNoteUseCase.execute(noteId, selectedSongForNoteEdit.id!, trackId);
        showToast({
          type: 'success',
          message: 'Note đã được xóa.',
        });
        if (onAfterChange) await onAfterChange();
      } catch (err) {
        console.error('Lỗi khi xóa Note:', err);
        showToast({
          type: 'error',
          message: 'Xóa Note thất bại.',
        });
      }
    }
  }, [selectedSongForNoteEdit, onAfterChange, showToast, showConfirmation]);

  const resetNotes = useCallback(() => {
    setSelectedSongForNoteEdit(null);
    setEditingNote(null);
  }, []);

  const initialNote = useMemo(() => {
    return selectedSongForNoteEdit && editingNote ? {
      songId: selectedSongForNoteEdit.id as string,
      trackId: editingNote.trackId as string,
      track: editingNote.track,
      time: editingNote.time,
      title: editingNote.title || '',
      description: editingNote.description || '',
      color: editingNote.color || '#007bff',
      icon: editingNote.icon || 'none',
    } : null
  }, [selectedSongForNoteEdit, editingNote])

  return {
    selectedSongForNoteEdit,
    startNoteManagement,
    editingNote,
    startEditNote,
    stopEditNote,
    saveNote,
    deleteNote,
    resetNotes,
    initialNote,
  };
}
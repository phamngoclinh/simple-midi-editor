import { useState } from 'react';
import { Song } from '../domain/entities/Song';
import { Note } from '../domain/entities/Note';
import {
  addNoteToSongUseCase,
  editExistingNoteUseCase,
  deleteExistingNoteUseCase
} from '../dependencies';

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

export default function useNotesManager(onAfterChange?: () => Promise<void>) {
  const [selectedSongForNoteEdit, setSelectedSongForNoteEdit] = useState<Song | null>(null);
  const [editingNote, setEditingNote] = useState<Note | null>(null);

  const startNoteManagement = (song: Song | null) => {
    setSelectedSongForNoteEdit(song);
    setEditingNote(null);
  };

  const startEditNote = (note: Note | null) => setEditingNote(note);

  const saveNote = async (noteData: NoteFormData) => {
    if (!selectedSongForNoteEdit) return;
    try {
      if (editingNote && editingNote.id) {
        await editExistingNoteUseCase.execute({ id: editingNote.id as string, ...noteData });
      } else {
        await addNoteToSongUseCase.execute({ ...noteData });
      }
      alert('Note đã được lưu thành công.');
      setEditingNote(null);
      if (onAfterChange) await onAfterChange();
    } catch (err: any) {
      console.error('Lỗi khi lưu Note:', err);
      alert('Lưu Note thất bại. ' + (err?.message || ''));
    }
  };

  const deleteNote = async (noteId: string) => {
    if (!selectedSongForNoteEdit) return;
    if (!window.confirm('Bạn có chắc chắn muốn xóa Note này không?')) return;
    try {
      const trackId = selectedSongForNoteEdit.tracks.find(t => t.notes.some(n => n.id === noteId))?.id;
      if (!trackId) throw new Error('Track ID không tìm thấy');
      await deleteExistingNoteUseCase.execute(noteId, selectedSongForNoteEdit.id!, trackId);
      alert('Note đã được xóa.');
      if (onAfterChange) await onAfterChange();
    } catch (err) {
      console.error('Lỗi khi xóa Note:', err);
      alert('Xóa Note thất bại.');
    }
  };

  const resetNotes = () => {
    setSelectedSongForNoteEdit(null);
    setEditingNote(null);
  };

  return {
    selectedSongForNoteEdit,
    startNoteManagement,
    editingNote,
    startEditNote,
    saveNote,
    deleteNote,
    resetNotes,
  };
}
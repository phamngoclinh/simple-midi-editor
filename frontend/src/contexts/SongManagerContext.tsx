import React, { createContext, useCallback } from 'react';
import { Song } from '../domain/entities/Song';
import { Note } from '../domain/entities/Note';
import useSongsList from '../hooks/useSongsList';
import useSongEditor from '../hooks/useSongEditor';
import useNotesManager from '../hooks/useNotesManager';

interface SongFormData {
  name: string;
  description: string;
  totalDuration: number;
  tracks: any[];
  tags: string[];
}

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

interface SongManagerContextValue {
  song: Song | null;
  songs: Song[];
  loading: boolean;
  selectedSongForNoteEdit: Song | null;
  editingNote: Note | null;
  initialNote: NoteFormData | null;
  loadSong: (songId: string) => Promise<Song | null>;
  loadSongs: () => Promise<void>;
  openCreateModal: () => void;
  closeAllModals: () => void;
  createSong: (data: SongFormData) => Promise<Song | void>;
  startEditSong: (song: Song | null) => void;
  editSong: (songId: string, data: SongFormData) => Promise<Song | void>;
  deleteSong: (songId: string, songName: string) => Promise<void>;
  openSong: (songId: string) => void;
  startNoteManagement: (song: Song | null) => void;
  startEditNote: (note: Note | null) => void;
  stopEditNote: () => void;
  saveNote: (data: NoteFormData) => Promise<void>;
  deleteNote: (noteId: string) => Promise<boolean>;
  importSong: () => void;
  exportSong: (song: Song) => void;
  isCreateModalOpen: boolean;
  editingSong: Song | null;
}

const defaultValue = {} as SongManagerContextValue;
export const SongManagerContext = createContext<SongManagerContextValue>(defaultValue);

export const SongManagerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const songsHook = useSongsList();
  const editorHook = useSongEditor(songsHook.triggerSong);
  const notesHook = useNotesManager();

  const closeAllModals = () => {
    editorHook.resetEditor();
    notesHook.resetNotes();
  };

  const openSong = (songId: string) => {
    window.location.href = `/editor/${songId}`;
  };

  const editSongProxy = useCallback(async (songId: string, songData: SongFormData) => {
    const song = await editorHook.editSong(songId, songData)
    songsHook.setSong(song);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <SongManagerContext.Provider
      value={{
        song: songsHook.song,
        songs: songsHook.songs,
        loading: songsHook.loading,
        selectedSongForNoteEdit: notesHook.selectedSongForNoteEdit,
        editingNote: notesHook.editingNote,
        initialNote: notesHook.initialNote,
        loadSong: songsHook.loadSong,
        loadSongs: songsHook.loadSongs,
        openCreateModal: editorHook.openCreateModal,
        closeAllModals,
        createSong: editorHook.createSong,
        startEditSong: editorHook.startEditSong,
        editSong: editSongProxy,
        deleteSong: editorHook.deleteSong,
        openSong,
        startNoteManagement: notesHook.startNoteManagement,
        startEditNote: notesHook.startEditNote,
        stopEditNote: notesHook.stopEditNote,
        saveNote: notesHook.saveNote,
        deleteNote: notesHook.deleteNote,
        importSong: songsHook.importSong,
        exportSong: songsHook.exportSong,
        isCreateModalOpen: editorHook.isCreateModalOpen,
        editingSong: editorHook.editingSong,
      }}
    >
      {children}
    </SongManagerContext.Provider>
  );
};
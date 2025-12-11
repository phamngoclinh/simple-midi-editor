import React, { createContext } from 'react';
import { Song } from '../domain/entities/Song';
import { Note } from '../domain/entities/Note';
import { SongSortBy, SortOrder } from '../application/song/ListAllSong';
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

interface SortState {
  by: SongSortBy;
  order: SortOrder;
}

interface SongManagerContextValue {
  songs: Song[];
  loading: boolean;
  sortState: SortState;
  selectedSongForNoteEdit: Song | null;
  editingNote: Note | null;
  initialNote: NoteFormData | null;
  loadSongs: () => Promise<void>;
  setSortState: (s: SortState) => void;
  openCreateModal: () => void;
  closeAllModals: () => void;
  createSong: (data: SongFormData) => Promise<Song | void>;
  startEditSong: (song: Song | null) => void;
  editSong: (songId: string, data: SongFormData) => Promise<Song | void>;
  deleteSong: (songId: string, songName: string) => Promise<void>;
  openSong: (songId: string) => void;
  startNoteManagement: (song: Song | null) => void;
  startEditNote: (note: Note | null) => void;
  saveNote: (data: NoteFormData) => Promise<void>;
  deleteNote: (noteId: string) => Promise<void>;
  importSong: () => void;
  exportSong: (song: Song) => void;
  isCreateModalOpen: boolean;
  editingSong: Song | null;
}

const defaultValue = {} as SongManagerContextValue;
export const SongManagerContext = createContext<SongManagerContextValue>(defaultValue);

export const SongManagerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const songsHook = useSongsList();
  const editorHook = useSongEditor(songsHook.loadSongs);
  const notesHook = useNotesManager(songsHook.loadSongs);

  const closeAllModals = () => {
    editorHook.resetEditor();
    notesHook.resetNotes();
  };

  const openSong = (songId: string) => {
    window.location.href = `/editor/${songId}`;
  };

  return (
    <SongManagerContext.Provider
      value={{
        songs: songsHook.songs,
        loading: songsHook.loading,
        sortState: songsHook.sortState,
        selectedSongForNoteEdit: notesHook.selectedSongForNoteEdit,
        editingNote: notesHook.editingNote,
        initialNote: notesHook.initialNote,
        loadSongs: songsHook.loadSongs,
        setSortState: songsHook.setSortState,
        openCreateModal: editorHook.openCreateModal,
        closeAllModals,
        createSong: editorHook.createSong,
        startEditSong: editorHook.startEditSong,
        editSong: editorHook.editSong,
        deleteSong: editorHook.deleteSong,
        openSong,
        startNoteManagement: notesHook.startNoteManagement,
        startEditNote: notesHook.startEditNote,
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
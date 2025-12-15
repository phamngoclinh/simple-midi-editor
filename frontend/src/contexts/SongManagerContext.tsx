/* eslint-disable react-hooks/exhaustive-deps */
import React, { createContext, useCallback } from 'react';
import { Song } from '../domain/entities/Song';
import { Note } from '../domain/entities/Note';
import useSongsList from '../hooks/useSongsList';
import useSongEditor from '../hooks/useSongEditor';
import useNotesManager from '../hooks/useNotesManager';
import useTrackManager from '../hooks/useTrackManager';

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
  editingNote: Note | null;
  initialNote: NoteFormData | null;
  isOpenEditNotes: boolean;
  loadSong: (songId: string) => Promise<Song | null>;
  loadSongs: () => Promise<void>;
  openCreateModal: () => void;
  closeAllModals: () => void;
  createSong: (data: SongFormData) => Promise<Song | void>;
  startEditSong: (song: Song | null) => void;
  editSong: (songId: string, data: SongFormData) => Promise<Song | void>;
  deleteSong: (songId: string, songName: string) => Promise<void>;
  openSong: (song: Song) => void;
  startEditNote: (note: Note | null) => void;
  startEditNotes: (song: Song) => void;
  stopEditNote: () => void;
  stopEditNotes: () => void;
  saveNote: (data: NoteFormData) => Promise<boolean>;
  setSong: (song: Song | null) => void;
  deleteNote: (noteId: string) => Promise<boolean>;
  importSong: () => void;
  exportSong: (song: Song) => void;
  isCreateModalOpen: boolean;
  editingSong: Song | null;
  editTrackLabel: (songId: string, trackId: string, newLabel: string) => Promise<void>;
}

const defaultValue = {} as SongManagerContextValue;
export const SongManagerContext = createContext<SongManagerContextValue>(defaultValue);

export const SongManagerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const songsHook = useSongsList();
  const editorHook = useSongEditor(songsHook.song, songsHook.triggerSong);
  const notesHook = useNotesManager(songsHook.onNoteChange);
  const tracksHook = useTrackManager();

  const closeAllModals = () => {
    songsHook.setSong(null);
    editorHook.resetEditor();
    notesHook.resetNotes();
  };

  const openSong = useCallback((song: Song) => {
    songsHook.setSong(song);
    window.location.href = `/editor/${song.id}`;
  }, []);

  const startEditNoteProxy = useCallback((song: Song) => {
    songsHook.setSong(song);
    notesHook.startEditNotes();
  }, [])

  const editTrackLabelProxy = useCallback(async (songId: string, trackId: string, newLabel: string) => {
    await tracksHook.editTrackLabel(songId, trackId, newLabel, () => {
      const songs = [...songsHook.songs];
      const s = songsHook.song;
      if (s && s.id === songId) {
        const track = s.tracks.find(t => t.id === trackId);
        if (track) track.label = newLabel;
        songsHook.setSong(s)
      }
      const sl = songs.find(s => s.id === songId);
      if (sl) {
        const track = sl.tracks.find(t => t.id === trackId);
        if (track) track.label = newLabel;
        songsHook.setSongs(songs)
      }
    })
  }, [tracksHook, songsHook])

  return (
    <SongManagerContext.Provider
      value={{
        song: songsHook.song,
        songs: songsHook.songs,
        loading: songsHook.loading,
        editingNote: notesHook.editingNote,
        initialNote: notesHook.initialNote,
        isOpenEditNotes: notesHook.isOpenEditNotes,
        loadSong: songsHook.loadSong,
        loadSongs: songsHook.loadSongs,
        openCreateModal: editorHook.openCreateModal,
        closeAllModals,
        createSong: editorHook.createSong,
        startEditSong: editorHook.startEditSong,
        editSong: editorHook.editSong,
        deleteSong: editorHook.deleteSong,
        openSong,
        startEditNote: notesHook.startEditNote,
        startEditNotes: startEditNoteProxy,
        stopEditNote: notesHook.stopEditNote,
        stopEditNotes: notesHook.stopEditNotes,
        saveNote: notesHook.saveNote,
        setSong: songsHook.setSong,
        deleteNote: notesHook.deleteNote,
        importSong: songsHook.importSong,
        exportSong: songsHook.exportSong,
        isCreateModalOpen: editorHook.isCreateModalOpen,
        editingSong: editorHook.editingSong,
        editTrackLabel: editTrackLabelProxy
      }}
    >
      {children}
    </SongManagerContext.Provider>
  );
};
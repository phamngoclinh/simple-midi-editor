import React, { useCallback } from 'react';
import { Song } from '../../domain/entities/Song';
import useNotesManager from '../../hooks/useNotesManager';
import MidiEditorContainer from './MidiEditorContainer';
import AsideNoteForm from './AsideNoteForm';
import AsideSongForm from './AsideSongForm';


interface MidiEditorProps {
  currentSong: Song;
  reload: () => void;
}

const MidiEditorManager: React.FC<MidiEditorProps> = ({ currentSong, reload }) => {
  const reloadCallback = useCallback(async () => reload(), [reload])
  const {
    initialNote,
    editingNote,
    startEditNote,
    stopEditNote,
    saveNote,
    deleteNote,
  } = useNotesManager(reloadCallback, currentSong);

  return <>
    <MidiEditorContainer currentSong={currentSong} onNoteClick={startEditNote} onSongUpdate={() => reload()} />

    {!!editingNote
      ? <AsideNoteForm song={currentSong} initialNote={initialNote} onCancel={stopEditNote} onSubmit={saveNote} onDelete={deleteNote} />
      : <AsideSongForm song={currentSong} />
    }
  </>
};

export default MidiEditorManager;

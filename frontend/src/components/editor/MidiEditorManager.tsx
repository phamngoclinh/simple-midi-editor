/* eslint-disable react-hooks/exhaustive-deps */
import React, { useCallback, useState } from 'react';
import { Song } from '../../domain/entities/Song';
import useNotesManager from '../../hooks/useNotesManager';
import MidiEditorContainer from './MidiEditorContainer';
import AsideNoteForm from './AsideNoteForm';
import AsideSongForm from './AsideSongForm';
import { Note } from '../../domain/entities/Note';


interface MidiEditorProps {
  currentSong: Song;
  reload: () => void;
}

const MidiEditorManager: React.FC<MidiEditorProps> = ({ currentSong, reload }) => {
  const [isOpenAside, setIsOpenAside] = useState<boolean>(true);
  const reloadCallback = useCallback(async () => reload(), [reload])
  const {
    initialNote,
    editingNote,
    startEditNote,
    stopEditNote,
    saveNote,
    deleteNote,
  } = useNotesManager(reloadCallback, currentSong);

  const handleStartEditNote = useCallback((note: Note | null) => {
    setIsOpenAside(true);
    startEditNote(note);
  }, [isOpenAside])

  return <>
    <MidiEditorContainer currentSong={currentSong} onNoteClick={handleStartEditNote} onSongUpdate={() => reload()} />

    <div className={`relative aside flex ${!isOpenAside ? 'w-0 closed' : ''}`}>
      {<span
        className='absolute block right-full top-1/2 mr-[-5px] text-[#282e39] cursor-pointer hover:text-[#505763]'
        onClick={() => setIsOpenAside(!isOpenAside)}
      >
        <span className="material-symbols-outlined">arrow_menu_close</span>
      </span>}
      {!!editingNote
        ? <AsideNoteForm song={currentSong} initialNote={initialNote} onCancel={stopEditNote} onSubmit={saveNote} onDelete={deleteNote} />
        : <AsideSongForm song={currentSong} />
      }
    </div>
  </>
};

export default MidiEditorManager;

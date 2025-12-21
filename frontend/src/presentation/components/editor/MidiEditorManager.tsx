/* eslint-disable react-hooks/exhaustive-deps */
import React, { useCallback, useState } from 'react';
import NoteEntity from '../../../domain/note/noteEntity';
import AsideNoteForm from './AsideNoteForm';
import AsideSongForm from './AsideSongForm';
import MidiEditorContainer from './MidiEditorContainer';

interface MidiEditorProps {
  songId: string;
}

const MidiEditorManager: React.FC<MidiEditorProps> = ({ songId }) => {
  const [isOpenAside, setIsOpenAside] = useState<boolean>(true);
  const [editingNote, setEditingNote] = useState<NoteEntity | null>(null);

  const handleStartEditNote = useCallback((note: NoteEntity | null) => {
    setIsOpenAside(true);
    setEditingNote(note);
  }, [isOpenAside])

  return <>
    <MidiEditorContainer songId={songId} onNoteClick={handleStartEditNote} />

    <div className={`relative aside flex ${!isOpenAside ? 'w-0 closed' : ''} transition duration-500 ease-in-out`}>
      {<span
        className='absolute block right-full top-1/2 mr-[-5px] text-[#282e39] cursor-pointer hover:text-[#505763]'
        onClick={() => setIsOpenAside(!isOpenAside)}
      >
        <span className='material-symbols-outlined'>arrow_menu_close</span>
      </span>}
      {!!editingNote
        ? <AsideNoteForm
            noteId={editingNote.id}
            onCancel={() => setEditingNote(null)}
          />
        : <AsideSongForm songId={songId} />
      }
    </div>
  </>
};

export default MidiEditorManager;

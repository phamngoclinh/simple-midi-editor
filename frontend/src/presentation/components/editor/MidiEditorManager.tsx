'use client';

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
  }, []);

  return (
    <div className="flex w-full">
      <MidiEditorContainer songId={songId} onNoteClick={handleStartEditNote} />

      <div
        className={`relative aside flex transition-width duration-500 ease-in-out`}
        style={{
          width: isOpenAside ? '400px' : '0',
        }}
      >
        {
          <span
            className="w-7 h-7 z absolute flex right-full top-1/2 mr-[-1px] text-border cursor-pointer hover:text-gray-500 bg-surface hover:bg-surface-hover border border-border z-100"
            onClick={() => setIsOpenAside(!isOpenAside)}
          >
            <span className="material-symbols-outlined">arrow_menu_close</span>
          </span>
        }
        {!!editingNote ? (
          <AsideNoteForm noteId={editingNote.id} onCancel={() => setEditingNote(null)} />
        ) : (
          <AsideSongForm songId={songId} />
        )}
      </div>
    </div>
  );
};

export default MidiEditorManager;

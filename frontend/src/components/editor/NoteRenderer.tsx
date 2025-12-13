import React from 'react';
import { Note } from '../../domain/entities/Note';
import { iconSymbolStyle } from './NoteRenderer.styles';
import { RenderableNote } from '../../hooks/useEditorGrid';
import { NOTE_SIZE_PX, RULER_WIDTH_PX } from './constants';

interface NoteRendererProps {
  notes: RenderableNote[];
  onNoteClick: (note: Note) => void;
}

const NoteRenderer: React.FC<NoteRendererProps> = ({ notes, onNoteClick }) => {
  return (
    <div className={`absolute inset-0 left-[${RULER_WIDTH_PX}px] flex`}>
      <div className='relative'>
        {notes.map((note) => {
          return (
            <div
              key={note.id || `${note.trackId}-${note.time}`}
              onClick={() => onNoteClick(note)}
              title={`Note: ${note.title || 'Untitled'} @ ${note.time}s`}
              className={`absolute top-[${note.y}px] left-[${note.x}px] w-[${NOTE_SIZE_PX}px] h-[${NOTE_SIZE_PX}px] -translate-x-[${NOTE_SIZE_PX/2}px] -translate-y-[${NOTE_SIZE_PX/2}px] rounded-full bg-[${note.color}] shadow-[0_0_15px_rgba(99,102,241,0.5)] cursor-pointer hover:scale-110 transition-transform flex items-center justify-center group`}
            >
              {note.icon && note.icon !== 'deselect' && (
                <span
                  style={iconSymbolStyle}
                  className="material-symbols-outlined text-white text-lg opacity-80"
                >
                  {note.icon}
                </span>
              )}
            </div>
          )
        })}
      </div>
    </div>
  );
};

export default NoteRenderer;

import React from 'react';
import { RenderableNote } from '../../hooks/useEditorGrid';
import { NOTE_SIZE_PX, RULER_WIDTH_PX } from '../../utils/editor';
import NoteEntity from '../../../domain/note/noteEntity';

interface NoteRendererProps {
  notes: RenderableNote[];
  onNoteClick: (note: NoteEntity) => void;
  onCreateNote?: () => void;
}

const NoteRenderer: React.FC<NoteRendererProps> = ({ notes, onNoteClick, onCreateNote }) => {
  return (
    <div
      style={{ left: `${RULER_WIDTH_PX}px` }}
      className="absolute inset-0 flex"
      onDoubleClick={onCreateNote}
    >
      <div className="relative">
        {notes.map(note => {
          return (
            <div
              key={note.id || `${note.trackId}-${note.time}`}
              onClick={() => onNoteClick(note)}
              title={`Note: ${note.title || 'Untitled'} @ ${note.time}s`}
              style={{
                top: `${note.y}px`,
                left: `${note.x}px`,
                width: `${NOTE_SIZE_PX}px`,
                height: `${NOTE_SIZE_PX}px`,
                transform: `translate(-50%, -50%)`,
                backgroundColor: note.color,
              }}
              className={`absolute rounded-full shadow-[0_0_15px_rgba(99,102,241,0.5)] cursor-pointer hover:scale-110 transition-transform flex items-center justify-center group`}
            >
              {note.icon && note.icon !== 'deselect' && (
                <span className="material-symbols-outlined text-white text-lg opacity-80">
                  {note.icon}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default NoteRenderer;

// src/components/editor/NoteRenderer.tsx
import React from 'react';
import { Note } from '../../domain/entities/Note';
import { HEADER_BOTTOM_GAP } from './constants';
import { NOTE_SIZE_PX, noteStyle, rendererStyle } from './NoteRenderer.styles';

// Note entity cần có thêm tọa độ x, y sau khi qua MidiEditorContainer
interface RenderableNote extends Note {
  x: number; // Tọa độ x (pixel)
  y: number; // Tọa độ y (pixel)
}

interface NoteRendererProps {
  notes: RenderableNote[];
  onNoteClick: (note: Note) => void;
}

const NoteRenderer: React.FC<NoteRendererProps> = ({ notes, onNoteClick }) => {
  return (
    <div style={rendererStyle}>
      {notes.map((note) => (
        <div
          key={note.id || `${note.trackId}-${note.time}`}
          style={{
            ...noteStyle,
            left: note.x - (NOTE_SIZE_PX / 2), // Căn giữa X
            top: note.y + HEADER_BOTTOM_GAP - (NOTE_SIZE_PX / 2), // Căn giữa Y
            backgroundColor: note.color || '#007bff',
          }}
          onClick={() => onNoteClick(note)}
          title={`Note: ${note.title || 'Untitled'} @ ${note.time}s`}
        />
      ))}
    </div>
  );
};

export default NoteRenderer;

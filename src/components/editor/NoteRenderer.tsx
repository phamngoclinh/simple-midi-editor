// src/components/editor/NoteRenderer.tsx
import React from 'react';
import { Note } from '../../domain/entities/Note';
import { HEADER_BOTTOM_GAP } from './constants';

// Note entity cần có thêm tọa độ x, y sau khi qua MidiEditorContainer
interface RenderableNote extends Note {
  x: number; // Tọa độ x (pixel)
  y: number; // Tọa độ y (pixel)
}

interface NoteRendererProps {
  notes: RenderableNote[];
  onNoteClick: (note: Note) => void;
}

// Kích thước Note
const NOTE_SIZE_PX = 20; // Kích thước (đường kính) của chấm tròn Note

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

// --- Styles cho Notes ---

const rendererStyle: React.CSSProperties = {
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
};

const noteStyle: React.CSSProperties = {
  position: 'absolute',
  width: NOTE_SIZE_PX,
  height: NOTE_SIZE_PX,
  borderRadius: '50%', // Hình tròn
  cursor: 'pointer',
  zIndex: 10,
  boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
  transition: 'transform 0.1s',
};
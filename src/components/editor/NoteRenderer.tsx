// src/components/editor/NoteRenderer.tsx
import React from 'react';
import { Note } from '../../domain/entities/Note';
import { MUSIC_ICONS } from '../../utils/icons';
import { HEADER_BOTTOM_GAP } from './constants';
import { contentStyle, iconSymbolStyle, NOTE_SIZE_PX, noteStyle, rendererStyle } from './NoteRenderer.styles';

// Note entity cần có thêm tọa độ x, y sau khi qua MidiEditorContainer
interface RenderableNote extends Note {
  x: number; // Tọa độ x (pixel)
  y: number; // Tọa độ y (pixel)
}

interface NoteRendererProps {
  notes: RenderableNote[];
  onNoteClick: (note: Note) => void;
}

const getIconSymbol = (iconKey: string | undefined): string | null => {
  if (!iconKey || iconKey === 'none') return null;
  
  const iconData = MUSIC_ICONS.find(i => i.key === iconKey);
  return iconData?.symbol || null;
};

const NoteRenderer: React.FC<NoteRendererProps> = ({ notes, onNoteClick }) => {
  return (
    <div style={rendererStyle}>
      {notes.map((note) => {
        const iconSymbol = getIconSymbol(note.icon);
        return (
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
          >
            <div style={contentStyle}>
              {iconSymbol ? (
                // Hiển thị Icon (lớn)
                <span style={iconSymbolStyle}>{iconSymbol}</span>
              ) : (
                <></>
              )}
            </div>
          </div>
        )
      })}
    </div>
  );
};

export default NoteRenderer;

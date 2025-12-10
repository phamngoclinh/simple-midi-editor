// src/components/note/NoteList.tsx
import React, { useState, useEffect } from 'react';
import { Note } from '../../domain/entities/Note'; // Import Entity Note
import { Song } from '../../domain/entities/Song'; // Import Song để lấy track label
import { listNotesInSongUseCase } from '../../dependencies'; // Use Case

// Định nghĩa Props
interface NoteListProps {
  /** ID của Song để tải Notes. */
  songId: string;
  /** Toàn bộ Song để map Track ID sang Track Label. */
  currentSong: Song;
  /** Hàm được gọi khi người dùng muốn chỉnh sửa một Note. */
  onEditNote: (note: Note) => void;
  /** Hàm được gọi khi người dùng muốn xóa một Note. */
  onDeleteNote: (noteId: string) => void; 
}

const NoteList: React.FC<NoteListProps> = ({ 
  songId, 
  currentSong, 
  onEditNote, 
  onDeleteNote 
}) => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // --- Hàm Tải Notes ---
  const loadNotes = async () => {
    setLoading(true);
    setError(null);
    try {
      // Gọi Use Case để tải danh sách Notes
      const fetchedNotes = await listNotesInSongUseCase.execute(songId);
      setNotes(fetchedNotes);
    } catch (err) {
      console.error("Lỗi khi tải Notes:", err);
      setError("Không thể tải danh sách Notes.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotes();
  }, [songId]); // Tải lại khi Song ID thay đổi

  // Hàm helper để tìm tên Track từ ID
  const getTrackLabel = (trackId?: string) => {
    if (!trackId) return 'Default Track';
    return currentSong.tracks.find(t => t.id === trackId)?.label || `Track #${trackId}`;
  };

  if (loading) return <div>Đang tải Notes...</div>;
  if (error) return <div style={{ color: 'red' }}>Lỗi: {error}</div>;

  return (
    <div style={containerStyle}>
      <h4>Danh Sách Notes ({notes.length})</h4>
      {notes.length === 0 ? (
        <p style={{ fontStyle: 'italic' }}>Chưa có Notes nào trong bài hát này.</p>
      ) : (
        <ul style={listStyle}>
          {notes.map(note => (
            <li key={note.id} style={{ ...listItemStyle, borderLeftColor: note.color || '#007bff' }}>
              <div style={noteInfoStyle}>
                <span style={noteTitleStyle} title={note.description}>
                  {note.title || 'Untitled Note'}
                </span>
                <span style={noteDetailsStyle}>
                  Track: **{getTrackLabel(note.trackId)}** | Time: **{note.time}**
                </span>
              </div>
              <div style={actionsStyle}>
                <button onClick={() => onEditNote(note)} style={editButtonStyle}>
                  Sửa
                </button>
                <button onClick={() => onDeleteNote(note.id!)} style={deleteButtonStyle}>
                  Xóa
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
      <button onClick={loadNotes} style={refreshButtonStyle}>
        Làm mới danh sách
      </button>
    </div>
  );
};

export default NoteList;

// --- Styles ---
const containerStyle: React.CSSProperties = {
  marginTop: '15px',
  paddingTop: '10px',
  borderTop: '1px solid #eee',
};

const listStyle: React.CSSProperties = {
  listStyle: 'none',
  padding: 0,
  maxHeight: '600px',
  overflow: 'auto'
};

const listItemStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '10px 15px',
  marginBottom: '8px',
  backgroundColor: '#fff',
  borderRadius: '4px',
  borderLeftWidth: '5px',
  borderLeftStyle: 'solid',
  boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
};

const noteInfoStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
};

const noteTitleStyle: React.CSSProperties = {
  fontWeight: 'bold',
  fontSize: '1em',
  marginBottom: '3px',
};

const noteDetailsStyle: React.CSSProperties = {
  fontSize: '0.85em',
  color: '#666',
};

const actionsStyle: React.CSSProperties = {
  display: 'flex',
  gap: '8px',
};

const buttonBaseStyle: React.CSSProperties = {
  padding: '6px 10px',
  fontSize: '0.85em',
  border: 'none',
  borderRadius: '3px',
  cursor: 'pointer',
};

const editButtonStyle: React.CSSProperties = {
  ...buttonBaseStyle,
  backgroundColor: '#ffc107',
  color: '#333',
};

const deleteButtonStyle: React.CSSProperties = {
  ...buttonBaseStyle,
  backgroundColor: '#dc3545',
  color: 'white',
};

const refreshButtonStyle: React.CSSProperties = {
    ...buttonBaseStyle,
    backgroundColor: '#007bff',
    color: 'white',
    marginTop: '10px',
};
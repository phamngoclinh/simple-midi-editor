// src/components/song/SongListItem.tsx
import React from 'react';
import { Song } from '../../domain/entities/Song'; // Import Entity Song

// Định nghĩa Props cho component
interface SongListItemProps {
  /** Dữ liệu Song cần hiển thị. */
  song: Song;
  /** Hàm được gọi khi người dùng nhấn nút "Open" (Mở Editor). */
  onOpen: (songId: string) => void;
  /** Hàm được gọi khi người dùng nhấn nút "Edit" (Mở Form chỉnh sửa). */
  onEdit: (songId: string) => void;
  /** Hàm được gọi khi người dùng nhấn nút "Delete". */
  onDelete: (songId: string) => void;
  /** Hàm được gọi khi người dùng nhấn nút "Edit Notes". */
  onEditNotes: (song: Song) => void;
  /** Hàm được gọi khi người dùng nhấn nút "Export". */
  onExport: (song: Song) => void;
}

const SongListItem: React.FC<SongListItemProps> = ({ 
  song, 
  onOpen, 
  onEdit, 
  onDelete,
  onEditNotes,
  onExport
}) => {
  // Định dạng timestamp cho dễ đọc
  const formattedDate = song.updatedTimestamp 
    ? new Date(song.updatedTimestamp).toLocaleDateString('vi-VN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      })
    : 'Chưa xác định';
  
  // Xử lý các sự kiện click
  const handleOpen = () => song.id && onOpen(song.id);
  const handleEdit = () => song.id && onEdit(song.id);
  const handleDelete = () => song.id && onDelete(song.id);
  const handleEditNotes = () => onEditNotes(song);
  const handleExportSong = () => onExport(song);

  return (
    <div style={itemContainerStyle}>
      {/* Thông tin Song */}
      <div style={infoStyle}>
        <span style={titleStyle} onClick={handleOpen} title="Mở Editor">
          {song.name}
        </span>
        <span style={metadataStyle}>
          Cập nhật: {formattedDate}
        </span>
      </div>

      {/* Các Nút Thao tác */}
      <div style={actionsStyle}>
        <button 
          onClick={handleExportSong} 
          style={{ ...buttonStyle, backgroundColor: '#ffc107' }}
          title="Export Song này thành JSON"
        >
          Export
        </button>
        <button 
          onClick={handleEditNotes} 
          style={{ ...buttonStyle, backgroundColor: '#17a2b8' }}
          title="Thêm/Sửa Notes cho Song"
        >
          Sửa Notes
        </button>
        <button 
          onClick={handleOpen} 
          style={{ ...buttonStyle, backgroundColor: '#28a745' }}
        >
          Mở Editor
        </button>
        <button 
          onClick={handleEdit} 
          style={{ ...buttonStyle, backgroundColor: '#ffc107', color: '#333' }}
        >
          Chỉnh Sửa
        </button>
        <button 
          onClick={handleDelete} 
          style={{ ...buttonStyle, backgroundColor: '#dc3545' }}
        >
          Xóa
        </button>
      </div>
    </div>
  );
};

export default SongListItem;

// --- Định nghĩa Style Cơ bản (Có thể thay bằng file CSS modules) ---

const itemContainerStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '15px',
  border: '1px solid #ddd',
  borderRadius: '8px',
  marginBottom: '10px',
  backgroundColor: '#f9f9f9',
};

const infoStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  flexGrow: 1,
};

const titleStyle: React.CSSProperties = {
  fontSize: '1.2em',
  fontWeight: 'bold',
  color: '#007bff',
  cursor: 'pointer',
  marginBottom: '5px',
};

const metadataStyle: React.CSSProperties = {
  fontSize: '0.9em',
  color: '#666',
};

const actionsStyle: React.CSSProperties = {
  display: 'flex',
  gap: '10px',
};

const buttonStyle: React.CSSProperties = {
  padding: '8px 12px',
  fontSize: '0.9em',
  color: 'white',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
  minWidth: '100px',
};
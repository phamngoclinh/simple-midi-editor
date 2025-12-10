// src/components/editor/TrackHeader.tsx
import React, { useState } from 'react';
import { Song } from '../../domain/entities/Song';
import { TRACK_WIDTH_PX, PRIMARY_GRID_COLOR } from './constants';
import { Track } from '../../domain/entities/Track';

interface TrackHeaderProps {
  currentSong: Song;
  totalWidth: number; // Tổng chiều rộng của khu vực Tracks
  onTrackLabelEdit: (trackId: string, newLabel: string) => void;
}

const TrackHeader: React.FC<TrackHeaderProps> = ({ currentSong, totalWidth, onTrackLabelEdit }) => {
  const [editingTrackId, setEditingTrackId] = useState<string | number | null>(null);
  const [tempLabel, setTempLabel] = useState('');

  // --- Hàm xử lý Bắt đầu Chỉnh sửa ---
  const handleStartEdit = (track: Track) => {
    if (!track.id) return; // Không cho chỉnh sửa nếu Track không có ID
    setEditingTrackId(track.id);
    setTempLabel(track.label);
  };

  // --- Hàm xử lý Lưu nhãn ---
  const handleSaveEdit = (trackId: string) => {
    const newLabel = tempLabel.trim();
    if (newLabel && newLabel !== currentSong.tracks.find(t => t.id === trackId)?.label) {
      // Gọi hàm callback từ component cha (MidiEditorContainer)
      onTrackLabelEdit(trackId, newLabel);
    }
    // Dù có thay đổi hay không, thoát khỏi chế độ chỉnh sửa
    setEditingTrackId(null);
    setTempLabel('');
  };

  // --- Hàm xử lý Keyboard (Nhấn Enter) ---
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, trackId: string) => {
    if (e.key === 'Enter') {
      handleSaveEdit(trackId);
    }
    if (e.key === 'Escape') {
      setEditingTrackId(null);
      setTempLabel('');
    }
  };

  // Lấy danh sách Tracks và sắp xếp theo order
  const sortedTracks = [...currentSong.tracks].sort((a, b) => (a.order || 0) - (b.order || 0));

  const renderTrackItem = (track: Track, index: number) => {
    const trackId = track.id || index;
    const isEditing = editingTrackId === trackId;

    return (
      <div 
        key={trackId} 
        style={{ ...trackHeaderItemStyle, width: TRACK_WIDTH_PX }}
        title={`Click để chỉnh sửa: ${track.label}`}
      >
        {isEditing ? (
          // Chế độ Input
          <input
            type="text"
            value={tempLabel}
            onChange={(e) => setTempLabel(e.target.value)}
            onBlur={() => handleSaveEdit(trackId as string)}
            onKeyDown={(e) => handleKeyDown(e, trackId as string)}
            style={inputStyle}
            autoFocus
          />
        ) : (
          // Chế độ Hiển thị (Clickable)
          <div onClick={() => handleStartEdit(track)} style={labelWrapperStyle}>
            <span style={labelStyle}>{track.label} ✎</span>
            <span style={orderStyle}>#{track.order || index + 1}</span>
          </div>
        )}
      </div>
    );
  };

  return (
    <div style={{ ...headerContainerStyle, width: totalWidth }}>
      {sortedTracks.map(renderTrackItem)}
    </div>
  );
};

export default TrackHeader;

// --- Styles cho Header ---

const HEADER_HEIGHT_PX = 50;

const labelWrapperStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
    cursor: 'pointer',
    padding: '0 5px',
};

const labelStyle: React.CSSProperties = {
    fontSize: '0.9em',
    fontWeight: 'bold',
    color: '#333',
    maxWidth: '90%',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
};

const inputStyle: React.CSSProperties = {
    width: '90%',
    padding: '3px 5px',
    fontSize: '0.9em',
    textAlign: 'center',
    border: '1px solid #007bff',
    borderRadius: '3px',
    boxSizing: 'border-box',
    height: '80%', // Chiếm gần hết chiều cao
};

const headerContainerStyle: React.CSSProperties = {
  display: 'flex',
  flexShrink: 0, // Quan trọng: Ngăn không cho container co lại
  height: HEADER_HEIGHT_PX,
  backgroundColor: '#f1f3f5', // Nền sáng
  borderBottom: `1px solid ${PRIMARY_GRID_COLOR}`,
  position: 'relative', // Relative để chứa các items
};

const trackHeaderItemStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  padding: '5px 0',
  boxSizing: 'border-box',
  borderRight: `1px solid ${PRIMARY_GRID_COLOR}`,
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
};

const orderStyle: React.CSSProperties = {
  fontSize: '0.7em',
  color: '#666',
  marginTop: '2px',
};
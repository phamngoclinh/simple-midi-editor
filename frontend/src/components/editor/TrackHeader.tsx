// src/components/editor/TrackHeader.tsx
import React, { useState } from 'react';
import { Song } from '../../domain/entities/Song';
import { TRACK_WIDTH_PX } from './constants';
import { Track } from '../../domain/entities/Track';
import { headerContainerStyle, inputStyle, labelStyle, labelWrapperStyle, orderStyle, trackHeaderItemStyle } from './TrackHeader.styles';

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

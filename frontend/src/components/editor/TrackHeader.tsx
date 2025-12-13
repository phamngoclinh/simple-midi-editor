import React, { useState } from 'react';
import { Song } from '../../domain/entities/Song';
import { TRACK_WIDTH_PX } from './constants';
import { Track } from '../../domain/entities/Track';
import { inputStyle, trackHeaderItemStyle } from './TrackHeader.styles';

interface TrackHeaderProps {
  currentSong: Song;
  totalWidth: number;
  onTrackLabelEdit: (trackId: string, newLabel: string) => void;
}

const TrackHeader: React.FC<TrackHeaderProps> = ({ currentSong, totalWidth, onTrackLabelEdit }) => {
  const [editingTrackId, setEditingTrackId] = useState<string | number | null>(null);
  const [tempLabel, setTempLabel] = useState('');

  const handleStartEdit = (track: Track) => {
    if (!track.id) return;
    setEditingTrackId(track.id);
    setTempLabel(track.label);
  };

  const handleSaveEdit = (trackId: string) => {
    const newLabel = tempLabel.trim();
    if (newLabel && newLabel !== currentSong.tracks.find(t => t.id === trackId)?.label) {
      onTrackLabelEdit(trackId, newLabel);
    }
    setEditingTrackId(null);
    setTempLabel('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, trackId: string) => {
    if (e.key === 'Enter') {
      handleSaveEdit(trackId);
    }
    if (e.key === 'Escape') {
      setEditingTrackId(null);
      setTempLabel('');
    }
  };

  const sortedTracks = [...currentSong.tracks].sort((a, b) => (a.order || 0) - (b.order || 0));

  const renderTrackItem = (track: Track, index: number) => {
    const trackId = track.id || index;
    const isEditing = editingTrackId === trackId;

    let intervalClasses = 'bg-[#111318]';
    if (index % 2) intervalClasses = 'bg-[#1c1f27]';

    return (
      <div 
        key={trackId}
        style={trackHeaderItemStyle}
        title={`Click để chỉnh sửa: ${track.label}`}
        className={`w-[${TRACK_WIDTH_PX}px] px-2 py-3 text-center text-white text-xs font-bold uppercase cursor-pointer border-r border-[#282e39] ${intervalClasses}`}
        onClick={() => handleStartEdit(track)}
      >
        {isEditing ? (
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
          <>
            <span>{track.label} ✎</span>
            <span>#{track.order || index + 1}</span>
          </>
        )}
      </div>
    );
  };

  return (
    <div className="flex-1 flex">
      {sortedTracks.map(renderTrackItem)}
    </div>
  );
};

export default TrackHeader;

import React from 'react';
import { Song } from '../../domain/entities/Song';
import { TRACK_WIDTH_PX } from './constants';
import { Track } from '../../domain/entities/Track';
import { trackHeaderItemStyle } from './TrackHeader.styles';

interface TrackHeaderProps {
  currentSong: Song;
  totalWidth: number;
  onTrackLabelEdit: (trackId: string, newLabel: string) => void;
}

const TrackHeader: React.FC<TrackHeaderProps> = ({ currentSong }) => {
  const sortedTracks = [...currentSong.tracks].sort((a, b) => (a.order || 0) - (b.order || 0));

  const renderTrackItem = (track: Track, index: number) => {
    const trackId = track.id || index;

    let intervalClasses = 'bg-[#111318]';
    if (index % 2) intervalClasses = 'bg-[#1c1f27]';

    return (
      <div 
        key={trackId}
        style={trackHeaderItemStyle}
        className={`w-[${TRACK_WIDTH_PX}px] px-2 py-3 text-center text-white text-sm font-bold uppercase ${intervalClasses}`}
      >
        <span>{track.label}</span>
        <span>#{track.order || index + 1}</span>
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

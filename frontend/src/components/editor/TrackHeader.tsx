import React from 'react';
import { Song } from '../../domain/entities/Song';
import { trackHeaderItemStyle } from './TrackHeader.styles';
import { ResizableColumn, useResizableContext } from '../../contexts/ResizableContext';

interface TrackHeaderProps {
  currentSong: Song;
  totalWidth: number;
  onTrackLabelEdit: (trackId: string, newLabel: string) => void;
}

interface TrackHeadItemProps {
  track: ResizableColumn;
  intervalClasses: string;
}

const TrackHeadItem: React.FC<TrackHeadItemProps> = ({ track, intervalClasses }) => {
  const { handleColumnResizeStart } = useResizableContext();
  return (
    <div 
      style={trackHeaderItemStyle}
      className={`w-[${track.width}px] px-2 py-3 text-center text-white text-sm font-bold uppercase ${intervalClasses} relative`}
    >
      <span className='block truncate'>{track.label}</span>
      <span>#{track.order + 1}</span>
      <div
        onMouseDown={(e) => handleColumnResizeStart(e, track.id)}
        className='absolute top-0 bottom-0 right-0 w-[5px] cursor-col-resize bg-transparent flex justify-center items-center hover:bg-[#333333] text-[#4c4c4c]'
      ></div>
    </div>
  );
}

const TrackHeader: React.FC<TrackHeaderProps> = ({ currentSong }) => {
  const { columns } = useResizableContext();

  const renderTrackItem = (track: ResizableColumn, index: number) => {
    const trackId = track.id || index;

    let intervalClasses = 'bg-[#111318]';
    if (index % 2) intervalClasses = 'bg-[#1c1f27]';

    return <TrackHeadItem key={trackId} track={track} intervalClasses={intervalClasses} />
  };

  return (
    <div className="flex-1 flex">
      {columns.map(renderTrackItem)}
    </div>
  );
};

export default TrackHeader;

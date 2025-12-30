import React from 'react';
import {
  ResizableColumn,
  useResizableContext,
} from '../../../infrastructure/stores/ResizableContext';

interface TrackHeaderProps {}

interface TrackHeadItemProps {
  track: ResizableColumn;
  intervalClasses: string;
}

const TrackHeadItem: React.FC<TrackHeadItemProps> = ({ track, intervalClasses }) => {
  const { handleColumnResizeStart } = useResizableContext();
  return (
    <div
      style={{ ...trackHeaderItemStyle, width: `${track.width}px` }}
      className={`px-2 py-3 text-center text-foreground text-sm font-bold uppercase ${intervalClasses} relative`}
    >
      <span className="block truncate">{track.label}</span>
      <span>#{track.order + 1}</span>
      <div
        onMouseDown={e => handleColumnResizeStart(e, track.id)}
        className="absolute top-0 bottom-0 right-0 w-[5px] cursor-col-resize bg-transparent flex justify-center items-center hover:bg-surface-hover text-muted-foreground"
      ></div>
    </div>
  );
};

const TrackHeader: React.FC<TrackHeaderProps> = () => {
  const { columns } = useResizableContext();

  const renderTrackItem = (track: ResizableColumn, index: number) => {
    const trackId = track.id || index;

    let intervalClasses = 'bg-background';
    if (index % 2) intervalClasses = 'bg-muted/50';

    return <TrackHeadItem key={trackId} track={track} intervalClasses={intervalClasses} />;
  };

  return <div className="flex-1 flex">{columns.map(renderTrackItem)}</div>;
};

export default TrackHeader;

const trackHeaderItemStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  padding: '5px 0',
  boxSizing: 'border-box',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
};

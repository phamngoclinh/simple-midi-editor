import React, { useMemo } from 'react';
import { PRIMARY_GRID_COLOR, SECONDARY_GRID_COLOR } from '../../utils/editor';

interface TimeGridProps {
  totalHeight: number;
  timeLines: { key: string; top: number; isMajorInterval: boolean }[];
  trackLines: { key: string; left: number }[];
}

const TimeGrid: React.FC<TimeGridProps> = ({ totalHeight, timeLines, trackLines }) => {
  const timeLinesRenderer = useMemo(() => {
    const lines = [];
    for (let i = 0; i < timeLines.length; i++) {
      lines.push(
        <React.Fragment key={timeLines[i].key}>
          <div
            style={{
              ...horizontalLineStyle,
              top: timeLines[i].top,
              borderBottomColor: timeLines[i].isMajorInterval
                ? PRIMARY_GRID_COLOR
                : SECONDARY_GRID_COLOR,
              borderBottomWidth: timeLines[i].isMajorInterval ? 1.5 : 1,
              opacity: timeLines[i].isMajorInterval ? 1.0 : 0.6,
            }}
          />
        </React.Fragment>,
      );
    }
    return lines;
  }, [timeLines]);

  const trackLinesRenderer = useMemo(() => {
    const lines = [];
    for (let i = 0; i < trackLines.length; i++) {
      lines.push(
        <div
          key={trackLines[i].key}
          style={{
            ...(i !== 0 ? verticalLineStyle : {}),
            left: trackLines[i].left,
            borderLeftColor: PRIMARY_GRID_COLOR,
          }}
        />,
      );
    }
    return lines;
  }, [trackLines]);

  return (
    <div style={{ ...gridStyle, height: totalHeight }}>
      {timeLinesRenderer}
      {trackLinesRenderer}
    </div>
  );
};

export default TimeGrid;

export const gridStyle: React.CSSProperties = {
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  pointerEvents: 'none',
  backgroundColor: '#f8f8f8',
};

export const horizontalLineStyle: React.CSSProperties = {
  position: 'absolute',
  width: '100%',
  borderBottomStyle: 'solid',
  borderBottomWidth: 1,
  transform: 'translateY(-0.5px)',
};

export const verticalLineStyle: React.CSSProperties = {
  position: 'absolute',
  height: '100%',
  borderLeftStyle: 'solid',
  borderLeftWidth: 1,
  transform: 'translateX(-1px)',
};

// src/components/editor/TimeGrid.tsx
import React, { useMemo } from 'react';
import {
  TRACK_WIDTH_PX,
  TIME_UNIT_HEIGHT_PX,
  SECONDS_PER_UNIT,
  PRIMARY_GRID_COLOR,
  SECONDARY_GRID_COLOR,
  HEADER_BOTTOM_GAP,
} from './constants';

interface TimeGridProps {
  numTracks: number;
  totalHeight: number;
  totalDuration: number;
}

const TimeGrid: React.FC<TimeGridProps> = ({ numTracks, totalHeight, totalDuration }) => {

  // Tạo các đường kẻ ngang (Timeline) và nhãn thời gian
  const timeLines = useMemo(() => {
    const lines = [];
    const interval = SECONDS_PER_UNIT;

    // Tính số lượng đơn vị thời gian
    const totalUnits = totalDuration / interval;

    for (let i = 0; i <= totalUnits; i++) {
      const timeInSeconds = i * interval;
      const yPos = i * TIME_UNIT_HEIGHT_PX;

      // Đường vạch 10 giây sẽ đậm hơn (major interval)
      const isMajorInterval = timeInSeconds % 10 === 0;

      lines.push(
        <React.Fragment key={`time-${i}`}>
          {/* Đường kẻ ngang */}
          <div
            style={{
              ...horizontalLineStyle,
              top: yPos + HEADER_BOTTOM_GAP,
              borderBottomColor: isMajorInterval ? PRIMARY_GRID_COLOR : SECONDARY_GRID_COLOR,
              borderBottomWidth: isMajorInterval ? 1.5 : 1,
              opacity: isMajorInterval ? 1.0 : 0.6,
            }}
          />
        </React.Fragment>
      );
    }
    return lines;
  }, [totalDuration]);

  // Tạo các đường kẻ dọc (Track Boundaries)
  const trackLines = useMemo(() => {
    const lines = [];
    for (let i = 0; i <= numTracks; i++) {
      const xPos = i * TRACK_WIDTH_PX;
      lines.push(
        <div
          key={`track-${i}`}
          style={{
            ...(i !== 0 ? verticalLineStyle : {}),
            left: xPos,
            // Đường phân chia Track rõ ràng
            borderLeftColor: PRIMARY_GRID_COLOR,
          }}
        />
      );
    }
    return lines;
  }, [numTracks]);

  return (
    <div style={{ ...gridStyle, height: totalHeight + HEADER_BOTTOM_GAP }}>
      {timeLines}
      {trackLines}
    </div>
  );
};

export default TimeGrid;

// --- Styles cho Grid ---

const gridStyle: React.CSSProperties = {
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%', // Kéo dài hết chiều rộng
  pointerEvents: 'none', // Cho phép click xuyên qua để tương tác với Notes
  backgroundColor: '#f8f8f8',
};

const horizontalLineStyle: React.CSSProperties = {
  position: 'absolute',
  width: '100%',
  borderBottomStyle: 'solid',
  borderBottomWidth: 1,
  transform: 'translateY(-0.5px)', // Căn giữa đường kẻ
};

const verticalLineStyle: React.CSSProperties = {
  position: 'absolute',
  height: '100%',
  borderLeftStyle: 'solid',
  borderLeftWidth: 1,
  transform: 'translateX(-1px)',
};
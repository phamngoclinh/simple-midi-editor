// src/components/editor/TimeRuler.tsx
import React, { useMemo } from 'react';
import {
  TIME_UNIT_HEIGHT_PX,
  SECONDS_PER_UNIT,
  PRIMARY_GRID_COLOR,
  HEADER_BOTTOM_GAP
} from './constants';

interface TimeRulerProps {
  totalDuration: number;
  totalHeight: number;
}

const RULER_WIDTH_PX = 40; // Chiều rộng cố định của thanh Ruler

const TimeRuler: React.FC<TimeRulerProps> = ({ totalDuration, totalHeight }) => {

  // Tạo các nhãn thời gian (chỉ hiển thị vạch 10 giây)
  const timeLabels = useMemo(() => {
    const labels = [];
    // Chỉ đánh dấu các vạch 10 giây (Major Interval)
    const majorInterval = 10;
    const intervalHeight = (majorInterval / SECONDS_PER_UNIT) * TIME_UNIT_HEIGHT_PX;

    // Tính số lần lặp 10 giây
    const totalIterations = Math.ceil(totalDuration / majorInterval);

    for (let i = 0; i <= totalIterations; i++) {
      const timeInSeconds = i * majorInterval;
      const yPos = i * intervalHeight;

      if (yPos > totalHeight + HEADER_BOTTOM_GAP) break; // Ngăn chặn nhãn vượt quá chiều cao

      labels.push(
        <div
          key={`ruler-${i}`}
          style={{
            ...labelStyle,
            top: yPos + HEADER_BOTTOM_GAP,
          }}
        >
          {timeInSeconds}s
        </div>
      );
    }
    return labels;
  }, [totalDuration, totalHeight]);

  return (
    <div style={{ ...rulerStyle, height: totalHeight + HEADER_BOTTOM_GAP, width: RULER_WIDTH_PX }}>
      {timeLabels}
    </div>
  );
};

export default TimeRuler;

// --- Styles cho Ruler ---

const rulerStyle: React.CSSProperties = {
  position: 'relative', // Giữ thanh Ruler cố định bên trái khi cuộn ngang
  left: 0,
  minHeight: '100%',
  backgroundColor: '#e9ecef', // Màu nền thước đo
  zIndex: 50, // Đảm bảo nằm trên TimeGrid
  borderRight: `1px solid ${PRIMARY_GRID_COLOR}`,
  boxSizing: 'content-box',
  flexShrink: 0
};

const labelStyle: React.CSSProperties = {
  position: 'absolute',
  right: 5,
  transform: 'translateY(-50%)', // Căn giữa theo vạch
  fontSize: '12px',
  color: PRIMARY_GRID_COLOR,
  fontWeight: 'bold',
  paddingLeft: '5px',
  height: '20px',
  lineHeight: '20px',
  textAlign: 'right',
  width: RULER_WIDTH_PX - 5,
};
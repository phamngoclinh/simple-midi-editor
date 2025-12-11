// src/components/editor/TimeRuler.tsx
import React, { useMemo } from 'react';
import {
  TIME_UNIT_HEIGHT_PX,
  SECONDS_PER_UNIT,
  HEADER_BOTTOM_GAP
} from './constants';
import { labelStyle, RULER_WIDTH_PX, rulerStyle } from './TimeRuler.styles';

interface TimeRulerProps {
  totalDuration: number;
  totalHeight: number;
}

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

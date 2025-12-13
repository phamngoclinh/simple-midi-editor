import React, { useMemo } from 'react';
import {
  TIME_UNIT_HEIGHT_PX,
  SECONDS_PER_UNIT,
  RULER_WIDTH_PX
} from './constants';

interface TimeRulerProps {
  totalDuration: number;
  totalHeight: number;
}

const TimeRuler: React.FC<TimeRulerProps> = ({ totalDuration, totalHeight }) => {

  const timeLabels = useMemo(() => {
    const labels = [];
    const majorInterval = 5;
    const intervalHeight = (majorInterval / SECONDS_PER_UNIT) * TIME_UNIT_HEIGHT_PX;

    const totalIterations = Math.ceil(totalDuration / majorInterval);

    for (let i = 0; i <= totalIterations; i++) {
      const timeInSeconds = i * majorInterval;
      const yPos = i * intervalHeight;

      if (yPos > totalHeight) break;

      const colors = ['#393d45ff', '#935656ff', '#393d45ff', '#279999ff']
      const color = colors[i % colors.length];

      labels.push(
        <div
          key={`ruler-${i}`}
          style={{
            top: yPos,
          }}
          className={`h-[${TIME_UNIT_HEIGHT_PX}px] border-b border-[${color}]/50 px-4 pt-2`}
        >
          {timeInSeconds}s
        </div>
      );
    }
    return labels;
  }, [totalDuration, totalHeight]);

  return (
    <div className={`w-[${RULER_WIDTH_PX}px] flex-none border-r border-[#282e39] bg-[#111318] flex flex-col text-[#58627a] text-xs font-mono select-none`}>
      {timeLabels}
    </div>
  );
};

export default TimeRuler;

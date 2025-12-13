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

      // const colors = ['#393d45ff', '#935656ff', '#393d45ff', '#279999ff']
      // const color = colors[i % colors.length];

      labels.push(
        <div
          key={`ruler-${i}`}
          style={{
            top: yPos,
          }}
          className={`h-[${TIME_UNIT_HEIGHT_PX}px] px-4 pt-2`}
          // className={`h-[${TIME_UNIT_HEIGHT_PX}px] border-b border-[${color}]/50 px-4 pt-2`}
        >
          {timeInSeconds}s
        </div>
      );
    }
    return labels;
  }, [totalDuration, totalHeight]);

  return (
    <div style={hightLightHorizontalLines} className={`w-[${RULER_WIDTH_PX}px] flex-none border-r border-[#282e39] bg-[#111318] flex flex-col text-[#58627a] text-sm font-mono select-none`}>
      {timeLabels}
    </div>
  );
};

export default TimeRuler;

const hightLightHorizontalLines: React.CSSProperties = {
  backgroundImage: 'linear-gradient(to bottom, #515c51ff 0px, #515c51ff 0px, transparent 0px, transparent calc(25% - 1px), #393d4580 calc(25% - 1px), #393d4580 25%, transparent 25%, transparent calc(50% - 1px), #93565680 calc(50% - 1px), #93565680 50%, transparent 50%, transparent calc(75% - 1px), #393d4580 calc(75% - 1px), #393d4580 75%, transparent 75%, transparent calc(100% - 1px), #27999980 calc(100% - 1px), #27999980 100%)',
  backgroundSize: `100% ${TIME_UNIT_HEIGHT_PX * 4}px`,
  backgroundRepeat: 'repeat'
}

import React, { useMemo } from 'react';

interface TimeRulerProps {
  totalDuration: number;
  totalHeight: number;
  width: number;
  timeUnitHeight: number;
  secondPerUnit: number;
  hightLightHorizontalLines: React.CSSProperties;
}

const TimeRuler: React.FC<TimeRulerProps> = ({
  totalDuration,
  totalHeight,
  width,
  timeUnitHeight,
  secondPerUnit,
  hightLightHorizontalLines,
}) => {
  const timeLabels = useMemo(() => {
    const labels = [];
    const majorInterval = 5;
    const intervalHeight = (majorInterval / secondPerUnit) * timeUnitHeight;

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
          className={`h-[${timeUnitHeight}px] px-4 pt-2`}
        >
          {timeInSeconds}s
        </div>
      );
    }
    return labels;
  }, [totalDuration, totalHeight, timeUnitHeight, secondPerUnit]);

  return (
    <div style={hightLightHorizontalLines} className={`w-[${width}px] flex-none border-r border-[#282e39] bg-[#111318] flex flex-col text-[#58627a] text-sm font-mono select-none`}>
      {timeLabels}
    </div>
  );
};

export default TimeRuler;


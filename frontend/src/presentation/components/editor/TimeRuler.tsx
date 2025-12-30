import React, { useMemo } from 'react';

interface TimeRulerProps {
  totalDuration: number;
  totalHeight: number;
  width: number;
  timeUnitHeight: number;
  secondPerUnit: number;
  hightLightHorizontalLines: React.CSSProperties;
}

const TimeRuler = ({
  totalDuration,
  totalHeight,
  width,
  timeUnitHeight,
  secondPerUnit,
  hightLightHorizontalLines,
}: TimeRulerProps) => {
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
            height: `${timeUnitHeight}px`,
          }}
          className="px-4 pt-2"
        >
          {timeInSeconds}s
        </div>,
      );
    }
    return labels;
  }, [totalDuration, totalHeight, timeUnitHeight, secondPerUnit]);

  return (
    <div
      style={{ ...hightLightHorizontalLines, width: `${width}px` }}
      className={`flex-none border-r border-border bg-background flex flex-col text-muted-foreground text-sm font-mono select-none`}
    >
      {timeLabels}
    </div>
  );
};

export default TimeRuler;

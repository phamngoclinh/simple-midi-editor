import { useEffect, useMemo } from 'react';
import NoteEntity from '../../domain/note/noteEntity';
import { useResizableContext } from '../../infrastructure/stores/ResizableContext';
import {
  DARK_GRAY_TIME_LINE_COLOR,
  GRAY_TIME_LINE_COLOR,
  HEADER_BOTTOM_GAP,
  MAX_DURATION_DEFAULT,
  MAX_TRACK_WIDTH_PX,
  MIN_TRACK_WIDTH_PX,
  NORMAL_TIME_LINE_COLOR,
  NOTE_SIZE_PX,
  RULER_WIDTH_PX,
  SECONDS_PER_UNIT,
  TIME_UNIT_HEIGHT_PX,
  TRACK_WIDTH_PX,
} from '../utils/editor';
import useSong from './song/useSong';

export interface RenderableNote extends NoteEntity {
  x: number;
  y: number;
  width: number;
  height: number;
}

const useEditorGrid = ({ songId }: { songId: string }) => {
  const { song, tracks, notes } = useSong({ id: songId });
  const { columns, initializeColumns } = useResizableContext();

  const timeUnitHeight = TIME_UNIT_HEIGHT_PX;
  const rulerWidth = RULER_WIDTH_PX;
  const secondPerUnit = SECONDS_PER_UNIT;
  const normalTimeLineColor = NORMAL_TIME_LINE_COLOR;
  const grayTimeLineColor = GRAY_TIME_LINE_COLOR;
  const darkGrayTimeLineColor = DARK_GRAY_TIME_LINE_COLOR;

  const totalDuration = song?.totalDuration || MAX_DURATION_DEFAULT;
  const numTracks = tracks.length;

  const totalEditorHeight =
    (totalDuration / SECONDS_PER_UNIT) * TIME_UNIT_HEIGHT_PX + HEADER_BOTTOM_GAP;
  const totalEditorWidth = numTracks * TRACK_WIDTH_PX;

  useEffect(() => {
    const sortedTracks = Object.values(tracks).sort((a, b) => (a.order || 0) - (b.order || 0));

    initializeColumns(
      sortedTracks.map(s => ({
        id: s.id,
        label: s.label,
        width: TRACK_WIDTH_PX,
        minWidth: MIN_TRACK_WIDTH_PX,
        maxWidth: MAX_TRACK_WIDTH_PX,
      })),
    );
  }, [tracks, initializeColumns]);

  const hightLightHorizontalLines: React.CSSProperties = {
    backgroundImage: `linear-gradient(to bottom, ${normalTimeLineColor} 0px, ${normalTimeLineColor} 0px, transparent 0px, transparent calc(25% - 1px), ${normalTimeLineColor} calc(25% - 1px), ${normalTimeLineColor} 25%, transparent 25%, transparent calc(50% - 1px), ${grayTimeLineColor} calc(50% - 1px), ${grayTimeLineColor} 50%, transparent 50%, transparent calc(75% - 1px), ${normalTimeLineColor} calc(75% - 1px), ${normalTimeLineColor} 75%, transparent 75%, transparent calc(100% - 1px), ${darkGrayTimeLineColor} calc(100% - 1px), ${darkGrayTimeLineColor} 100%)`,
    backgroundSize: `100% ${timeUnitHeight * 4}px`,
    backgroundRepeat: 'repeat',
  };

  const timeLines = useMemo(() => {
    const lines = [];
    const interval = SECONDS_PER_UNIT;

    const totalUnits = totalDuration / interval;

    for (let i = 0; i <= totalUnits; i++) {
      const timeInSeconds = i * interval;
      const yPos = i * TIME_UNIT_HEIGHT_PX;

      const isMajorInterval = timeInSeconds % 10 === 0;

      lines.push({
        key: `time-${i}`,
        top: yPos + HEADER_BOTTOM_GAP,
        isMajorInterval,
      });
    }
    return lines;
  }, [totalDuration]);

  const trackLines = useMemo(() => {
    const lines = [];
    for (let i = 0; i <= numTracks; i++) {
      const xPos = i * TRACK_WIDTH_PX;
      lines.push({
        key: `track-${i}`,
        left: xPos,
      });
    }
    return lines;
  }, [numTracks]);

  const allNoteWidth = { beforeWidth: 0 };

  const columnPositionX = tracks.map((track, index) => {
    const x = allNoteWidth.beforeWidth;
    allNoteWidth.beforeWidth += columns[index]?.width || TRACK_WIDTH_PX;
    return [x, columns[index]?.width || TRACK_WIDTH_PX];
  });

  const allNotes: RenderableNote[] = notes.map(note => {
    const trackIdx = tracks.findIndex(x => x.id === note.trackId);
    const [x, width] = columnPositionX[trackIdx] || [0, TRACK_WIDTH_PX];
    return {
      ...note,
      x: x + width / 2,
      y: (note.time / SECONDS_PER_UNIT) * TIME_UNIT_HEIGHT_PX,
      width: NOTE_SIZE_PX,
      height: NOTE_SIZE_PX,
    };
  });

  return {
    timeUnitHeight,
    rulerWidth,
    secondPerUnit,
    normalTimeLineColor,
    grayTimeLineColor,
    darkGrayTimeLineColor,
    hightLightHorizontalLines,
    totalDuration,
    numTracks,
    totalEditorHeight,
    totalEditorWidth,
    timeLines,
    trackLines,
    allNotes,
    columns,
  };
};

export default useEditorGrid;

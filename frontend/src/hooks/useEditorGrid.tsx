import { useCallback, useMemo } from "react";
import { HEADER_BOTTOM_GAP, MAX_DURATION_DEFAULT, NOTE_SIZE_PX, SECONDS_PER_UNIT, TIME_UNIT_HEIGHT_PX, TRACK_WIDTH_PX } from "../components/editor/constants";
import { Note } from "../domain/entities/Note";
import { Song } from "../domain/entities/Song";

export interface RenderableNote extends Note {
  x: number
  y: number
  width: number;
  height: number;
}

const useEditorGrid = ({ currentSong }: { currentSong: Song }) => {
  const totalDuration = currentSong.totalDuration || MAX_DURATION_DEFAULT
  const numTracks = currentSong.tracks.length;

  const totalEditorHeight = (totalDuration / SECONDS_PER_UNIT) * TIME_UNIT_HEIGHT_PX + HEADER_BOTTOM_GAP;
  const totalEditorWidth = numTracks * TRACK_WIDTH_PX;

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
      })
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
      })
    }
    return lines;
  }, [numTracks]);


  const trackIdToIndex = useMemo(() => {
    return currentSong.tracks.reduce((map, track, index) => {
      map.set(track.order, index);
      return map;
    }, new Map<string | number, number>());
  }, [currentSong.tracks]);

  const timeToY = useCallback((time: number): number => {
    return (time / SECONDS_PER_UNIT) * TIME_UNIT_HEIGHT_PX;
  }, []);

  const trackIndexToX = useCallback((index: number): number => {

    return index * TRACK_WIDTH_PX + (TRACK_WIDTH_PX / 2);
  }, []);


  const allNotes: RenderableNote[] = useMemo(() => {
    return currentSong.tracks.flatMap(track =>
      (track.notes || []).map(note => ({
        ...note,
        x: trackIndexToX(trackIdToIndex.get(track.order)!),
        y: timeToY(note.time),
        width: NOTE_SIZE_PX,
        height: NOTE_SIZE_PX,
      }))
    );
  }, [currentSong.tracks, trackIdToIndex, trackIndexToX, timeToY]);

  return {
    totalDuration,
    numTracks,
    totalEditorHeight,
    totalEditorWidth,
    timeLines,
    trackLines,
    trackIdToIndex,
    allNotes,
  }
}

export default useEditorGrid;
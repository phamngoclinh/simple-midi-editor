import { useCallback, useMemo } from "react";
import { HEADER_BOTTOM_GAP, MAX_DURATION_DEFAULT, NOTE_SIZE_PX, PRIMARY_GRID_COLOR, SECONDARY_GRID_COLOR, SECONDS_PER_UNIT, TIME_UNIT_HEIGHT_PX, TRACK_WIDTH_PX } from "../components/editor/constants";
import { Note } from "../domain/entities/Note";
import { Song } from "../domain/entities/Song";

export interface RenderableNote extends Note {
  x: number; // Tọa độ x (pixel)
  y: number; // Tọa độ y (pixel)
  width: number;
  height: number;
}

const useEditorGrid = ({ currentSong }: { currentSong: Song }) => {
  // Tính toán kích thước Editor
  const totalDuration = currentSong.totalDuration || MAX_DURATION_DEFAULT; // Giả định totalDuration tính bằng giây
  const numTracks = currentSong.tracks.length;

  // Tính tổng chiều cao và chiều rộng của khu vực cuộn
  const totalEditorHeight = (totalDuration / SECONDS_PER_UNIT) * TIME_UNIT_HEIGHT_PX + HEADER_BOTTOM_GAP;
  const totalEditorWidth = numTracks * TRACK_WIDTH_PX;

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

      lines.push({
        key: `time-${i}`,
        top: yPos + HEADER_BOTTOM_GAP,
        isMajorInterval,
      })
    }
    return lines;
  }, [totalDuration]);

  // Tạo các đường kẻ dọc (Track Boundaries)
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

  // --- Logic Chuyển đổi Tọa độ ---

  // Ánh xạ Track ID sang vị trí Index (0, 1, 2...)
  const trackIdToIndex = useMemo(() => {
    return currentSong.tracks.reduce((map, track, index) => {
      map.set(track.order, index);
      return map;
    }, new Map<string | number, number>());
  }, [currentSong.tracks]);

  // Hàm chuyển đổi thời gian (giây) sang vị trí Y (pixel)
  const timeToY = useCallback((time: number): number => {
    return (time / SECONDS_PER_UNIT) * TIME_UNIT_HEIGHT_PX;
  }, []);

  // Hàm chuyển đổi Track Index sang vị trí X (pixel)
  const trackIndexToX = useCallback((index: number): number => {
    // Vị trí X là điểm giữa của Track
    return index * TRACK_WIDTH_PX + (TRACK_WIDTH_PX / 2);
  }, []);

  // --- Thu thập tất cả Notes ---

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
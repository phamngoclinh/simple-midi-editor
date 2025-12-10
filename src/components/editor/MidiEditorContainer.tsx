// src/components/editor/MidiEditorContainer.tsx
import React, { useCallback, useMemo, useRef } from 'react';
import { useModal } from '../../contexts/ModalContext';
import { editTrackLabelUseCase } from '../../dependencies';
import { Note } from '../../domain/entities/Note';
import { Song } from '../../domain/entities/Song';
import {
  HEADER_BOTTOM_GAP,
  MAX_DURATION_DEFAULT,
  SECONDS_PER_UNIT,
  TIME_UNIT_HEIGHT_PX,
  TRACK_WIDTH_PX
} from './constants';
import { containerStyle, cornerBlockStyle, editorWrapperStyle, headerRulerWrapperStyle, scrollAreaContentStyle } from './MidiEditorContainer.styles';
import NoteRenderer from './NoteRenderer';
import TimeGrid from './TimeGrid';
import TimeRuler from './TimeRuler';
import TrackHeader from './TrackHeader';

interface MidiEditorContainerProps {
  currentSong: Song;
  // Giả định có hàm để xử lý Note click (ví dụ: mở Modal Edit)
  onNoteClick: (note: Note) => void;
  onSongUpdate: (updatedSong: Song) => void;
}

const MidiEditorContainer: React.FC<MidiEditorContainerProps> = ({ currentSong, onNoteClick, onSongUpdate }) => {
  const editorRef = useRef<HTMLDivElement>(null);

  const { showToast } = useModal();

  // Tính toán kích thước Editor
  const totalDuration = currentSong.totalDuration || MAX_DURATION_DEFAULT; // Giả định totalDuration tính bằng giây
  const numTracks = currentSong.tracks.length;

  // Tính tổng chiều cao và chiều rộng của khu vực cuộn
  const totalEditorHeight = (totalDuration / SECONDS_PER_UNIT) * TIME_UNIT_HEIGHT_PX;
  const totalEditorWidth = numTracks * TRACK_WIDTH_PX;

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

  const allNotes = useMemo(() => {
    return currentSong.tracks.flatMap(track =>
      (track.notes || []).map(note => ({
        ...note,
        // Gán thêm tọa độ X, Y cho Note để NoteRenderer dễ dàng render
        x: trackIndexToX(trackIdToIndex.get(track.order)!),
        y: timeToY(note.time),
      }))
    );
  }, [currentSong.tracks, trackIdToIndex, trackIndexToX, timeToY]);

  // --- Hàm xử lý Chỉnh sửa Track Label ---
  const handleTrackLabelEdit = useCallback(async (trackId: string, newLabel: string) => {
    if (!currentSong.id) return;
    
    // Tìm Track hiện tại để đảm bảo các giá trị khác không thay đổi
    const trackToUpdate = currentSong.tracks.find(t => t.id === trackId);
    if (!trackToUpdate) return;
    
    console.log(`Đang cố gắng cập nhật Track ID ${trackId} với Label: "${newLabel}"`);

    // 💥 LOGIC GỌI USE CASE:
    try {
      const updatedSong = await editTrackLabelUseCase.execute({
        songId: currentSong.id,
        trackId: trackId,
        newLabel: newLabel
      });
      onSongUpdate(updatedSong); // Cập nhật lại state Song trong component cha
    } catch (error) {
      console.error("Lỗi khi cập nhật Track Label:", error);
      showToast({
        type: 'error',
        message: "Cập nhật nhãn Track thất bại."
      });
    }
    
  }, [currentSong, onSongUpdate, showToast]);

  return (
    <div style={containerStyle}>
      <div style={headerRulerWrapperStyle}>
        {/* 1. Góc trên bên trái (Giao điểm của Ruler và Header) */}
        <div style={cornerBlockStyle} />

        {/* 2. Track Header (Cuộn ngang cùng Editor) */}
        <div>
          <TrackHeader
            currentSong={currentSong}
            totalWidth={totalEditorWidth}
            onTrackLabelEdit={handleTrackLabelEdit}
          />
        </div>
      </div>
      <div style={editorWrapperStyle}>
        <TimeRuler
          totalDuration={totalDuration}
          totalHeight={totalEditorHeight}
        />
        <div
          ref={editorRef}
          style={{ width: '100%' }} // Chiều rộng 100% của container cha
        >
          {/* Khu vực có thể cuộn */}
          <div style={{ ...scrollAreaContentStyle, width: totalEditorWidth, height: totalEditorHeight + HEADER_BOTTOM_GAP }}>

            {/* 1. Grid và Timeline */}
            <TimeGrid
              numTracks={numTracks}
              totalHeight={totalEditorHeight}
              totalDuration={totalDuration}
            />

            {/* 2. Notes Renderer */}
            <NoteRenderer
              notes={allNotes}
              onNoteClick={onNoteClick}
            />

          </div>
        </div>
      </div>
    </div>
  );
};

export default MidiEditorContainer;

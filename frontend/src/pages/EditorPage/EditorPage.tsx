// src/pages/EditorPage/EditorPage.tsx
import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Song } from '../../domain/entities/Song';
import MidiEditorManager from '../../components/editor/MidiEditorManager';
import { loadSongByIdUseCase } from '../../dependencies';

const EditorPage = () => {
  const { songId } = useParams<{ songId: string }>();
  const [song, setSong] = useState<Song | null>(null);

  const handleLoadData = useCallback((songId?: string) => {
    if (songId) {
      // 1. Dùng Use Case để tải dữ liệu
      loadSongByIdUseCase.execute(songId).then(setSong); 
      console.log(`Đang tải Song có ID: ${songId}`);
    }
  }, [])

  useEffect(() => {
    handleLoadData(songId);
  }, [songId, handleLoadData]);

  return (
    <div>
      <h2>Chỉnh sửa Song: {song?.name || songId}</h2>
      {/* ... Giao diện Timeline và Notes ... */}
      {song && <MidiEditorManager currentSong={song} reload={() => handleLoadData(songId)} />}
    </div>
  );
};

export default EditorPage;
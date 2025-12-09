// src/pages/EditorPage/EditorPage.tsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Song } from '../../domain/entities/Song';
// import { loadSongByIdUseCase } from '../../dependencies';

const EditorPage = () => {
  // Lấy giá trị của tham số :songId
  const { songId } = useParams<{ songId: string }>();
  const [song] = useState<Song | null>(null);

  useEffect(() => {
    if (songId) {
      // 1. Dùng Use Case để tải dữ liệu
      // loadSongByIdUseCase.execute(songId).then(setSong); 
      console.log(`Đang tải Song có ID: ${songId}`);
    }
  }, [songId]);

  return (
    <div>
      <h2>Chỉnh sửa Song: {song?.name || songId}</h2>
      {/* ... Giao diện Timeline và Notes ... */}
    </div>
  );
};

export default EditorPage;
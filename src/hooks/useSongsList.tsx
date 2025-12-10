import { useCallback, useEffect, useState } from 'react';
import { Song } from '../domain/entities/Song';
import { SongSortBy, SortOrder } from '../application/song/ListAllSong';
import { listAllSongsUseCase, importSongFromJsonUseCase, exportSongToJsonUseCase } from '../dependencies';

interface SortState {
  by: SongSortBy;
  order: SortOrder;
}

export default function useSongsList(initialSort: SortState = { by: 'updated', order: 'desc' }) {
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [sortState, setSortState] = useState<SortState>(initialSort);

  const loadSongs = useCallback(async () => {
    setLoading(true);
    try {
      const all = await listAllSongsUseCase.execute(sortState.by, sortState.order);
      setSongs(all);
    } catch (err) {
      console.error('Lỗi khi tải Songs:', err);
      alert('Không thể tải danh sách bài hát.');
    } finally {
      setLoading(false);
    }
  }, [sortState]);

  useEffect(() => {
    loadSongs();
  }, [loadSongs]);

  const importSong = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = async (ev) => {
        const jsonString = ev.target?.result as string;
        try {
          const newSong = await importSongFromJsonUseCase.execute(jsonString);
          alert(`Đã import và tạo Song mới: "${newSong.name}"`);
          await loadSongs();
        } catch (err: any) {
          console.error('Lỗi khi import Song:', err);
          alert('Import Song thất bại: ' + (err?.message || ''));
        }
      };
      reader.readAsText(file);
    };
    input.click();
  };

  const exportSong = (song: Song) => {
    try {
      const jsonString = exportSongToJsonUseCase.execute(song);
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${song.name.replace(/\s/g, '_')}_export.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      alert(`Đã export Song "${song.name}" thành công.`);
    } catch (err: any) {
      console.error('Lỗi khi export Song:', err);
      alert('Export Song thất bại: ' + (err?.message || ''));
    }
  };

  return {
    songs,
    loading,
    sortState,
    setSortState,
    loadSongs,
    importSong,
    exportSong,
    setSongs, // exported in case callers want local updates (like delete optimistically)
  };
}
/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback, useState } from 'react';
import { useModal } from '../contexts/ModalContext';
import { exportSongToJsonUseCase, importSongFromJsonUseCase, listAllSongsUseCase, loadSongByIdUseCase } from '../dependencies';
import { Song } from '../domain/entities/Song';
import { SongTriggerAction } from '../utils/types';
import { Note } from '../domain/entities/Note';

export default function useSongsList() {
  const [song, setSong] = useState<Song | null>(null);
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const { showToast } = useModal();

  const loadSongs = useCallback(async () => {
    setLoading(true);
    try {
      const all = await listAllSongsUseCase.execute('created', 'asc');
      setSongs(all);
    } catch (err: any) {
      console.error('Lỗi khi tải Songs:', err);
      showToast({
        type: 'error',
        message: 'Không thể tải danh sách bài hát.',
        extraMessage: err?.message
      });
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  const loadSong = useCallback(async (songId: string) => {
    let song = null;
    setLoading(true);
    try {
      song = await loadSongByIdUseCase.execute(songId);
      setSong(song);
      return song;
    } catch (err: any) {
      console.error('Lỗi khi tải Songs:', err);
      showToast({
        type: 'error',
        message: 'Không thể tải bài hát',
        extraMessage: err?.message
      })
    } finally {
      setLoading(false);
    }
    return song;
  }, []);

  const triggerSong = useCallback(async (songData: Song, action: SongTriggerAction) => {
    console.log(`Trigger Song có ID: ${songData.id}. Action ${action}`);
    switch (action) {
      case 'delete':
        setSong(null)
        setSongs(prev => prev.filter(s => s.id !== songData.id))
        break;
      case 'update':
        setSong(songData);
        setSongs(prev => {
          return prev.map(song => {
            if (song.id === songData.id) {
              return songData;
            }
            return song;
          });
        });
        break;
      case 'create':
        setSong(songData);
        setSongs(prev => [...prev, songData]);
        break;
      case 'fetch':
        await loadSong(songData.id as string);
        break;
      case 'set':
        setSong(songData);
        break;
      case 'unset':
        setSong(null);
        break;
      default:
        break;
    }
  }, [loadSong])

  const onNoteChange = useCallback(async (note: Note, action: 'create' | 'update' | 'delete') => {
    console.log(`On Note change có ID: ${note.id}. Action ${action}`);
    switch (action) {
      case 'create':
        {
          if (!song) return;
          const currentSong = song;
          const currentTrack = currentSong.tracks.find(t => t.id === note.trackId);
          if (currentTrack) {
            currentTrack.notes = [...currentTrack.notes, note];
          }
          if (song && currentSong.id === song.id) {
            setSong(currentSong);
          }
          if (songs.length) {
            setSongs(prev => {
              const index = prev.findIndex(s => s.id === currentSong.id);
              prev[index] = currentSong;
              return prev;
            });
          }
        }
        break;
      case 'update':
        {
          if (!song) return;
          const currentSong = song;
          let oldTrack = currentSong.tracks.find(t => t.notes.some(n => n.id === note.id));
          let targetNote = oldTrack?.notes.find(n => n.id === note.id);
          if (!targetNote) {
            console.error("Không tìm thấy Note mục tiêu để cập nhật.");
            return;
          }
          const oldTrackId = targetNote.trackId;
          const newTrackId = note.trackId;
          if (oldTrackId === newTrackId) {
            Object.assign(targetNote, note);
          } else {
              const newTrack = currentSong.tracks.find(t => t.id === newTrackId);
              if (!newTrack) {
                console.error(`Không tìm thấy Track mới với ID: ${newTrackId}`);
                return;
              }
              if (oldTrack) {
                oldTrack.notes = oldTrack.notes.filter(n => n.id !== note.id);
              }
              const newNote: Note = {
                ...targetNote,
                ...note,
                trackId: newTrackId,
              } as Note; 
              newTrack.notes.push(newNote);
          }
          if (song && currentSong.id === song.id) {
            setSong(currentSong);
          }
          if (songs.length) {
            setSongs(prev => {
              const index = prev.findIndex(s => s.id === currentSong.id);
              prev[index] = currentSong;
              return prev;
            });
          }
        }
        break;
      case 'delete':
        {
          if (!song) return;
          const currentSong = song;
          const currentTrack = currentSong.tracks.find(t => t.notes.some(n => n.id === note.id));
          if (currentTrack) {
            currentTrack.notes = [...currentTrack.notes.filter(n => n.id !== note.id)];
          }
          if (song && currentSong.id === song.id) {
            setSong(currentSong);
          }
          if (songs.length) {
            setSongs(prev => {
              const index = prev.findIndex(s => s.id === currentSong.id);
              prev[index] = currentSong;
              return prev;
            });
          }
        }
        break;
      default:
        break;
    }
  }, [songs, song])

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
          showToast({
            type: 'success',
            message: `Đã import và tạo Song mới: "${newSong.name}"`,
          });
          await loadSongs();
        } catch (err: any) {
          console.error('Lỗi khi import Song:', err);
          showToast({
            type: 'error',
            message: 'Import Song thất bại',
            extraMessage: err?.message
          });
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
      showToast({
        type: 'success',
        message: `Đã export Song "${song.name}" thành công.`,
      });
    } catch (err: any) {
      console.error('Lỗi khi export Song:', err);
      showToast({
        type: 'error',
        message: 'Export Song thất bại',
        extraMessage: err?.message
      });
    }
  };

  return {
    song,
    songs,
    loading,
    loadSong,
    loadSongs,
    importSong,
    exportSong,
    setSongs,
    setSong,
    triggerSong,
    onNoteChange,
  };
}
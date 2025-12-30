import { useCallback, useState } from 'react';
import { initializeSongUseCase } from '../../../dependencies';
import { useSongsState } from '../../../infrastructure/stores/studio';
import { SongFormData } from '../../utils/types';
import { useUseCase } from '../useUseCase';

export const useSongFormInitializer = () => {
  const { songs, tracks, notes } = useSongsState();
  const [formValues, setFormValues] = useState<SongFormData>();
  const { call } = useUseCase();

  const getSongById = useCallback(
    (id: string) => {
      const song = songs[id];
      const songTracks = Object.values(tracks).filter(t => t.songId === id);
      const songTrackIds = songTracks.map(t => t.id);
      const songNotes = Object.values(notes).filter(t => songTrackIds.includes(t.trackId));
      return {
        song,
        tracks: songTracks,
        notes: songNotes,
      };
    },
    [songs, tracks, notes],
  );

  const initializeUpdateForm = useCallback(
    (songId: string): SongFormData => {
      const song = getSongById(songId);

      if (!song) throw new Error(`Không tồn tại dữ liệu bài hát với SongId = ${songId}`);

      const songFormData: SongFormData = {
        id: song.song.id,
        name: song.song.name,
        description: song.song.description,
        totalDuration: song.song.totalDuration,
        tags: song.song.tags,
        tracks: song.tracks.map(track => ({
          songId: song.song.id,
          id: track.id,
          label: track.label,
          order: track.order,
          instrument: track.instrument,
          notes: song.notes
            .filter(n => n.trackId === track.id)
            .map(n => ({
              id: n.id,
              time: n.time,
              title: n.title,
              description: n.description,
              color: n.color,
              icon: n.icon,
              songId: song.song.id,
              trackId: track.id,
            })),
        })),
      };

      setFormValues(songFormData);

      return songFormData;
    },
    [getSongById],
  );

  const initializeCreateForm = useCallback(async () => {
    const messages = { error: 'Không thể khởi tạo dữ liệu cho Form' };
    const response = await call(async () => await initializeSongUseCase.execute(), messages);
    if (!response.success) return;
    const song = response.data;
    const songFormData: SongFormData = {
      id: song.id,
      name: song.name,
      description: song.description,
      totalDuration: song.totalDuration,
      tags: song.tags,
      tracks: song.tracks.map(track => ({
        songId: song.id,
        id: track.id,
        label: track.label,
        order: track.order,
        instrument: track.instrument,
        notes: track.notes.map(n => ({
          id: n.id,
          time: n.time,
          title: n.title,
          description: n.description,
          color: n.color,
          icon: n.icon,
          songId: song.id,
          trackId: track.id,
        })),
      })),
    };

    setFormValues(songFormData);

    return songFormData;
  }, [call]);

  return { formValues, initializeUpdateForm, initializeCreateForm };
};

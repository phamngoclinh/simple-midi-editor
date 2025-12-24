import { useCallback, useState } from 'react';
import generateId from '../../../application/usecases/common/generateId';
import { useSongsState } from '../../../infrastructure/stores/studio';
import { NoteFormData } from '../../utils/types';

export const useNoteFormInitializer = () => {
  const [formValues, setFormValues] = useState<NoteFormData>();
  const { songs, tracks, notes } = useSongsState();

  const initializeUpdateForm = useCallback((noteId: string): NoteFormData => {
    const note = notes[noteId];

    if (!note) throw new Error(`Không tồn tại dữ liệu note với NoteId = ${noteId}`);

    const track = tracks[note.trackId];

    if (!track) throw new Error(`Không tồn tại dữ liệu track với NoteId = ${noteId}`);

    const song = songs[track.songId];

    if (!song) throw new Error(`Không tồn tại dữ liệu song với NoteId = ${noteId}`);

    const songTracks = Object.values(tracks).filter(t => t.songId === song.id);

    const noteFormData: NoteFormData = {
      id: noteId,
      songId: song.id,
      trackId: track.id,
      time: note.time,
      title: note.title,
      description: note.description,
      color: note.color,
      icon: note.icon,
      tracks: songTracks.map(track => {
        return {
          id: track.id,
          label: track.label,
          order: track.order,
        }
      }),
      maxTime: song.totalDuration,
    };

    setFormValues(noteFormData);

    return noteFormData;
  }, [songs, tracks, notes]);

  const initializeCreateForm = useCallback((songId: string) => {
    const song = songs[songId];

    if (!song) throw new Error(`Không tồn tại dữ liệu bài hát với SongId = ${songId}`);

    const songTracks = Object.values(tracks).filter(t => t.songId === songId);

    const noteFormData: NoteFormData = {
      id: generateId('note'),
      songId: songId,
      trackId: songTracks[0].id,
      time: 0,
      title: '',
      description: '',
      color: '#135bec',
      icon: 'none',
      tracks: songTracks.map(t => ({
        id: t.id,
        label: t.label,
        order: t.order,
      })),
      maxTime: song.totalDuration,
    };

    setFormValues(noteFormData);

    return noteFormData;
  }, [songs])

  return { formValues, initializeUpdateForm, initializeCreateForm };
};
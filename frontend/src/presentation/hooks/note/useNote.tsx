import { useMemo } from 'react';
import { useStudioSelector } from '../../../infrastructure/stores/studio';

const useNote = (noteId: string) => {
  const note = useStudioSelector(state => state.notes[noteId]);
  const tracks = useStudioSelector(state => state.tracks);
  const songs = useStudioSelector(state => state.songs);
  
  const track = useMemo(() => {
    return tracks[note.trackId] || null;
  }, [note, tracks])

  const song = useMemo(() => {
    if (!track) return null;
    return songs[track.songId] || null;
  }, [track, songs])

  return {
    note,
    track,
    song
  };
}

export default useNote;
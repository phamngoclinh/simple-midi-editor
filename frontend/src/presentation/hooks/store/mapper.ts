import NoteEntity from '../../../domain/note/noteEntity';
import SongAggregate from '../../../domain/songAggregate/songAggregate';
import TrackEntity from '../../../domain/track/trackEntity';
import { SongChangePayload } from '../../../infrastructure/stores/studio';

export const storeSongMapper = {
  toSongChangePayload: (songData: SongAggregate): SongChangePayload => {
    const { tracks: trackData, ...song } = songData;
    const tracks: TrackEntity[] = [];
    const notes: NoteEntity[] = [];
    trackData.forEach(t => {
      const { notes: trackNotes, ...track } = t;
      tracks.push({
        ...track,
        songId: song.id,
      })
      trackNotes.forEach(n => {
        notes.push({
          ...n,
          trackId: track.id,
        })
      })
    });
    return {
      song: song,
      tracks: tracks,
      notes: notes,
    }
  }
}
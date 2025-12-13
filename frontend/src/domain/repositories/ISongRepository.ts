import { Song } from '../entities/Song';
import { Track } from '../entities/Track';

export interface ISongRepository {
  create(song: Song): Promise<Song>;

  update(song: Partial<Song> & Required<Pick<Song, 'id'>>): Promise<Song>;

  findById(id: string): Promise<Song | null>;

  findAll(): Promise<Song[]>;

  deleteById(id: string): Promise<void>;

  updateTrackLabel(songId: string, trackId: string, label: string): Promise<Track>;
}
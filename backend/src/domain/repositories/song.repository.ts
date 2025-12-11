import { DeepPartial } from 'typeorm';
import { Song } from '../entities/song.entity';

export abstract class ISongRepository {
  abstract mergeSong(song: Song, update: DeepPartial<Song>): Song;
  abstract createSong(data: Song): Song;
  abstract saveSong(data: Song): Promise<Song>;
  abstract findSongById(id: string): Promise<Song | null>;
  abstract findAllSong(): Promise<Song[]>;
  abstract deleteSong(id: string): Promise<{ affected?: number | null }>;
}

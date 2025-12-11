// src/domain/repositories/ISongRepository.ts

import { Song } from '../entities/Song'; // Giả sử đã định nghĩa
import { Track } from '../entities/Track';

/**
 * Interface Repository cho thực thể Song.
 * Đây là "Hợp đồng" mà lớp Infrastructure phải thực thi.
 */
export interface ISongRepository {
  create(song: Song): Promise<Song>;

  update(song: Partial<Song> & Required<Pick<Song, 'id'>>): Promise<Song>;

  findById(id: string): Promise<Song | null>;

  findAll(): Promise<Song[]>;

  deleteById(id: string): Promise<void>;

  updateTrackLabel(songId: string, trackId: string, label: string): Promise<Track>;
}
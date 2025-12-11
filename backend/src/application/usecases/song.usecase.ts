/**
 * Application Layer - Get Delivery Stats Use Case
 * Retrieves delivery statistics for a given time period
 */

import { Song } from 'src/domain/entities/song.entity';
import { ITrackRepository } from 'src/domain/repositories/track.repository';
import { ISongRepository } from 'src/domain/repositories/song.repository';
import { INoteRepository } from 'src/domain/repositories/note.repository';

export interface UpdateSongDto {
  id: string;
  name?: string;
  description?: string;
  totalDuration?: number;
  tags?: string[];
  tracks?: {
    id: string;
    label?: string;
    order?: number;
    instrument?: string;
  }[];
}

export class SongsUseCase {
  constructor(private readonly songsRepository: ISongRepository) { }

  // Lấy tất cả Songs (chỉ metadata)
  findAll(): Promise<Song[]> {
    return this.songsRepository.findAllSong(); // Lấy kèm thông tin Tracks
  }

  // Lấy chi tiết Song (bao gồm Notes)
  async findOne(id: string): Promise<Song> {
    const song = await this.songsRepository.findSongById(id);

    if (!song) {
      throw new Error(`Song with ID "${id}" not found`);
    }

    // Sắp xếp Tracks và Notes theo order/time (tùy chọn, nên xử lý ở Frontend)
    song.tracks.sort((a, b) => a.order - b.order);

    return song;
  }

  // Tạo Song mới
  async create(createSong: Song): Promise<Song> {
    const song = this.songsRepository.createSong(createSong);

    return this.songsRepository.saveSong(song);
  }

  // Cập nhật Song
  async update(updateSong: UpdateSongDto): Promise<Song> {
    // 1. Lấy Song hiện tại để kiểm tra
    const existingSong = await this.songsRepository.findSongById(updateSong.id);

    if (!existingSong) {
      throw new Error(`Song with ID "${updateSong.id}" not found`);
    }

    // 2. Merge DTO với Entity hiện có
    const updatedSong = this.songsRepository.mergeSong(
      existingSong,
      updateSong,
    );

    // 3. Xử lý logic phức tạp (Ví dụ: đồng bộ Tracks)
    // *Việc xử lý đồng bộ mảng lồng nhau (Track/Note) là phức tạp và thường cần các thư viện bổ sung
    // hoặc logic xóa/tạo lại thủ công. Ở đây, ta chỉ cập nhật metadata cơ bản.*

    return this.songsRepository.saveSong(updatedSong);
  }

  // Xóa Song
  async remove(id: string): Promise<void> {
    const result = await this.songsRepository.deleteSong(id);
    if (result.affected === 0) {
      throw new Error(`Song with ID "${id}" not found`);
    }
  }
}

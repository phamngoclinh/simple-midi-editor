/**
 * Application Layer - Get Delivery Stats Use Case
 * Retrieves delivery statistics for a given time period
 */

import { Song } from 'src/domain/entities/song.entity';
import { SongNotFoundException } from 'src/domain/exceptions/SongNotFound.exception';
import { ISongRepository } from 'src/domain/repositories/song.repository';
import { ITrackRepository } from 'src/domain/repositories/track.repository';

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
  constructor(
    private readonly songsRepository: ISongRepository,
    private readonly tracksRepository: ITrackRepository,
  ) { }

  // Lấy tất cả Songs (chỉ metadata)
  findAll(): Promise<Song[]> {
    return this.songsRepository.findAllSong(); // Lấy kèm thông tin Tracks
  }

  // Lấy chi tiết Song (bao gồm Notes)
  async findOne(id: string): Promise<Song> {
    const song = await this.songsRepository.findSongById(id);

    if (!song) {
      throw new SongNotFoundException({ id });
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
      throw new SongNotFoundException({ id: updateSong.id });
    }

    if (updateSong.tracks) {
      // Lấy IDs của các Tracks cần giữ lại (tức là có trong payload mới)
      const tracksToKeepIds = new Set(
        updateSong.tracks.map(trackDto => trackDto.id).filter(id => id),
      );

      // Lấy IDs của các Tracks hiện có trong DB cần xóa
      const tracksToRemove = existingSong.tracks.filter(track => !tracksToKeepIds.has(track.id));

      // Thực hiện xóa các Tracks không có trong payload
      if (tracksToRemove.length > 0) {
        const trackIdsToRemove = tracksToRemove.map(t => t.id);

        // Vì Track có quan hệ One-to-Many với Note và có 'onDelete: CASCADE',
        // việc xóa Track sẽ tự động xóa các Notes liên quan.
        await this.tracksRepository.deleteTracks(trackIdsToRemove);

        existingSong.tracks = existingSong.tracks.filter(
          track => !trackIdsToRemove.includes(track.id),
        );
      }
    }

    // 2. Merge DTO với Entity hiện có
    const updatedSong = this.songsRepository.mergeSong(existingSong, updateSong);

    // 3. Xử lý logic phức tạp (Ví dụ: đồng bộ Tracks)
    // *Việc xử lý đồng bộ mảng lồng nhau (Track/Note) là phức tạp và thường cần các thư viện bổ sung
    // hoặc logic xóa/tạo lại thủ công. Ở đây, ta chỉ cập nhật metadata cơ bản.*

    return this.songsRepository.saveSong(updatedSong);
  }

  // Xóa Song
  async remove(id: string): Promise<void> {
    const result = await this.songsRepository.deleteSong(id);
    if (result.affected === 0) {
      throw new SongNotFoundException({ id });
    }
  }
}

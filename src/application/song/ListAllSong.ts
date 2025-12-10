// src/application/song/ListAllSongs.ts
import { ISongRepository } from '../../domain/repositories/ISongRepository';
import { Song } from '../../domain/entities/Song';

// Định nghĩa các tiêu chí sắp xếp hợp lệ
export type SongSortBy = 'name' | 'updated' | 'created' | 'totalDuration';
export type SortOrder = 'asc' | 'desc'; // Ascending (tăng dần) hoặc Descending (giảm dần)

/**
 * Lớp Use Case: Tải tất cả các Song hiện có trong hệ thống.
 */
export class ListAllSongs {
  private songRepository: ISongRepository;

  constructor(songRepository: ISongRepository) {
    this.songRepository = songRepository;
  }

  /**
   * Thực thi Use Case.
   * @returns Promise trả về mảng tất cả các Song.
   */
  async execute(sortBy: SongSortBy = 'updated', order: SortOrder = 'desc'): Promise<Song[]> {
    const songs = await this.songRepository.findAll();

    const direction = order === 'asc' ? 1 : -1;

    // 1. Áp dụng logic sắp xếp
    songs.sort((a, b) => {
      let aValue: any;
      let bValue: any;

      // Chuẩn bị giá trị để so sánh dựa trên tiêu chí
      switch (sortBy) {
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case 'created':
          aValue = new Date(a.createdTimestamp || 0).getTime();
          bValue = new Date(b.createdTimestamp || 0).getTime();
          break;
        case 'totalDuration':
          aValue = a.totalDuration;
          bValue = b.totalDuration;
          break;
        case 'updated':
        default:
          aValue = new Date(a.updatedTimestamp || 0).getTime();
          bValue = new Date(b.updatedTimestamp || 0).getTime();
          break;
      }

      // 2. Thực hiện so sánh
      if (aValue < bValue) return -1 * direction;
      if (aValue > bValue) return 1 * direction;
      return 0; // Bằng nhau
    });
    return songs;
  }
}
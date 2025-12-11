// src/application/song/DeleteSong.ts

import { ISongRepository } from '../../domain/repositories/ISongRepository';

/**
 * Lớp Use Case: Xóa một Song và tất cả dữ liệu liên quan.
 */
export class DeleteSong {
  private songRepository: ISongRepository;

  constructor(songRepository: ISongRepository) {
    this.songRepository = songRepository;
  }

  /**
   * Thực thi Use Case.
   * @param songId ID của bài hát cần xóa.
   * @returns Promise<void> báo hiệu việc xóa hoàn tất.
   * @throws Error nếu xảy ra lỗi trong quá trình xóa.
   */
  async execute(songId: string): Promise<void> {
    return this.songRepository.deleteById(songId);
  }
}
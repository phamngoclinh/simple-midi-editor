// src/application/song/LoadSongById.ts

import { ISongRepository } from '../../domain/repositories/ISongRepository';
import { Song } from '../../domain/entities/Song';

/**
 * Lớp Use Case: Tải một bài hát cụ thể dựa trên ID.
 */
export class LoadSongById {
    private songRepository: ISongRepository;

    constructor(songRepository: ISongRepository) {
        this.songRepository = songRepository;
    }

    /**
     * Thực thi Use Case.
     * @param songId ID của bài hát cần tải.
     * @returns Promise trả về thực thể Song.
     * @throws Error nếu không tìm thấy bài hát.
     */
    async execute(songId: string): Promise<Song> {
        // 1. Sử dụng Repository để tìm kiếm
        const song = await this.songRepository.findById(songId);

        // 2. Áp dụng quy tắc nghiệp vụ: Song phải tồn tại
        if (!song) {
            throw new Error(`Song with ID "${songId}" not found.`);
        }

        // 3. Trả về kết quả
        return song;
    }
}
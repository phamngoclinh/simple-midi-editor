// src/application/song/EditSong.ts

import { ISongRepository } from '../../domain/repositories/ISongRepository';
import { Song } from '../../domain/entities/Song';

/**
 * DTO (Data Transfer Object) cho dữ liệu cần chỉnh sửa.
 * Tất cả các thuộc tính đều là tùy chọn (optional) trừ ID.
 */
/**
 * Lớp Use Case: Chỉnh sửa các thuộc tính cấp cao của một Song.
 */
export class EditSong {
    private songRepository: ISongRepository;

    constructor(songRepository: ISongRepository) {
        this.songRepository = songRepository;
    }

    /**
     * Thực thi Use Case.
     * @param data Dữ liệu chứa ID và các trường cần cập nhật.
     * @returns Promise trả về Song đã được cập nhật.
     * @throws Error nếu Song không tồn tại.
     */
    async execute(data: Partial<Song> & Required<Pick<Song, 'id'>>): Promise<Song> {
        return this.songRepository.update(data);
    }
}
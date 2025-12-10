// src/application/song/EditSong.ts

import { ISongRepository } from '../../domain/repositories/ISongRepository';
import { Song } from '../../domain/entities/Song';
import { Track } from '../../domain/entities/Track';

/**
 * DTO (Data Transfer Object) cho dữ liệu cần chỉnh sửa.
 * Tất cả các thuộc tính đều là tùy chọn (optional) trừ ID.
 */
export interface EditSongData {
    id: string; // (BẮT BUỘC) ID của bài hát cần chỉnh sửa
    name?: string;
    description?: string;
    totalDuration?: number;
    tracks?: Track[];
    tags?: string[];
}

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
    async execute(data: EditSongData): Promise<Song> {
        // 1. Tải Song hiện tại
        const song = await this.songRepository.findById(data.id);

        if (!song) {
            throw new Error(`Song with ID "${data.id}" not found for editing.`);
        }

        // 2. Áp dụng các thay đổi từ DTO
        if (data.name !== undefined) {
            song.name = data.name;
        }
        if (data.description !== undefined) {
            song.description = data.description;
        }
        if (data.totalDuration !== undefined) {
            song.totalDuration = data.totalDuration;
        }
        if (data.tracks !== undefined) {
            song.tracks = data.tracks;
        }
        if (data.tags !== undefined) {
            song.tags = data.tags;
        }

        // 3. Sử dụng Repository để lưu lại (cập nhật)
        const updatedSong = await this.songRepository.save(song);

        return updatedSong;
    }
}
// src/domain/repositories/ISongRepository.ts

import { Song } from '../entities/Song'; // Giả sử đã định nghĩa

/**
 * Interface Repository cho thực thể Song.
 * Đây là "Hợp đồng" mà lớp Infrastructure phải thực thi.
 */
export interface ISongRepository {
    /**
     * Lưu một bài hát mới hoặc cập nhật bài hát hiện có.
     * @param song Dữ liệu bài hát cần lưu.
     * @returns Promise trả về bài hát đã được lưu (bao gồm cả ID nếu là mới).
     */
    save(song: Song): Promise<Song>;

    /**
     * Tải một bài hát dựa trên ID.
     * @param id ID của bài hát.
     * @returns Promise trả về Song hoặc null nếu không tìm thấy.
     */
    findById(id: string): Promise<Song | null>;

    /**
     * Tải tất cả các bài hát.
     * @returns Promise trả về mảng các Song.
     */
    findAll(): Promise<Song[]>;

    /**
     * Xóa một bài hát dựa trên ID.
     * @param id ID của bài hát cần xóa.
     * @returns Promise void.
     */
    deleteById(id: string): Promise<void>;
}
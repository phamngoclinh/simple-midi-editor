// src/domain/repositories/INoteRepository.ts

import { Note } from '../entities/Note'; // Giả sử đã định nghĩa

/**
 * Interface Repository cho thực thể Note.
 */
export interface INoteRepository {
    /**
     * Thêm hoặc cập nhật một Note.
     * @param note Dữ liệu Note cần lưu.
     * @returns Promise trả về Note đã được lưu.
     */
    save(note: Note): Promise<Note>;

    /**
     * Tải tất cả Notes thuộc về một Song cụ thể.
     * @param songId ID của Song.
     * @returns Promise trả về mảng các Note.
     */
    findBySongId(songId: string): Promise<Note[]>;

    /**
     * Xóa một Note dựa trên ID.
     * @param id ID của Note cần xóa.
     * @returns Promise void.
     */
    deleteById(id: string, songId: string): Promise<void>;

    /**
     * Xóa tất cả Notes thuộc về một Song cụ thể.
     * @param songId ID của Song.
     * @returns Promise void.
     */
    deleteAllBySongId(songId: string): Promise<void>;
}
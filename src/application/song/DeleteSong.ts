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
        // 1. Quy tắc nghiệp vụ: Đảm bảo người dùng có quyền xóa (logic này sẽ ở lớp Domain hoặc Use Case, 
        // nhưng để đơn giản, ta chỉ cần gọi Repository)

        // 2. Sử dụng Repository để thực hiện việc xóa
        // Lưu ý: Triển khai Repository (Infrastructure) phải đảm bảo xóa cả Note (và Track)
        // liên quan đến Song này để tránh dữ liệu mồ côi (orphan data).
        await this.songRepository.deleteById(songId);

        // Xử lý logic hậu xóa (ví dụ: gửi thông báo đến các hệ thống khác)
        // ...
    }
}
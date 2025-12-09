// src/application/note/DeleteExistingNote.ts

import { INoteRepository } from '../../domain/repositories/INoteRepository';
import { ISongRepository } from '../../domain/repositories/ISongRepository';

/**
 * Lớp Use Case: Xóa một Note cụ thể khỏi Song.
 */
export class DeleteExistingNote {
    private noteRepository: INoteRepository;
    private songRepository: ISongRepository;

    constructor(noteRepository: INoteRepository, songRepository: ISongRepository) {
        this.noteRepository = noteRepository;
        this.songRepository = songRepository;
    }

    /**
     * Thực thi Use Case.
     * @param noteId ID của Note cần xóa.
     * @param songId ID của Song chứa Note đó.
     * @returns Promise<void>.
     */
    async execute(noteId: string, songId: string, trackId: string): Promise<void> {
        // 1. Thực hiện xóa Note bằng Note Repository
        await this.noteRepository.deleteById(noteId, songId);

        // 2. Tải Song và cập nhật Track (loại bỏ Note khỏi mảng Track.notes)
        const song = await this.songRepository.findById(songId);

        if (song) {
            const track = song.tracks.find(x => x.id === trackId);
            if (track) {
                track.notes = track.notes.filter(n => n.id !== noteId);
                await this.songRepository.save(song); // Lưu lại Song đã cập nhật
            }
        }
        // Nếu Song không tìm thấy, việc xóa Note vẫn thành công.
    }
}
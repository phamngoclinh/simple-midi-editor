// src/application/note/ListNotesInSong.ts

import { INoteRepository } from '../../domain/repositories/INoteRepository';
import { Note } from '../../domain/entities/Note';

/**
 * Lớp Use Case: Liệt kê tất cả Notes thuộc về một Song.
 */
export class ListNotesInSong {
    private noteRepository: INoteRepository;

    constructor(noteRepository: INoteRepository) {
        this.noteRepository = noteRepository;
    }

    /**
     * Thực thi Use Case.
     * @param songId ID của Song.
     * @returns Promise trả về mảng Notes thuộc về Song đó.
     */
    async execute(songId: string): Promise<Note[]> {
        // 1. Sử dụng Note Repository để truy vấn
        const notes = await this.noteRepository.findBySongId(songId);

        // 2. Áp dụng các quy tắc nghiệp vụ/sắp xếp (nếu có, ví dụ: sắp xếp theo thời gian)
        notes.sort((a, b) => a.time - b.time);

        return notes;
    }
}
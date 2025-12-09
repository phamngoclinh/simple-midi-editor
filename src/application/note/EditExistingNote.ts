// src/application/note/EditExistingNote.ts

import { INoteRepository } from '../../domain/repositories/INoteRepository';
import { ISongRepository } from '../../domain/repositories/ISongRepository';
import { Note } from '../../domain/entities/Note';

/**
 * DTO cho dữ liệu cần chỉnh sửa của Note.
 */
export interface EditNoteData {
    id: string; // ID của Note cần chỉnh sửa
    songId: string; // ID của Song chứa Note này
    trackId: string;
    time?: number;
    title?: string;
    description?: string;
    color?: string;
    icon?: string;
}

/**
 * Lớp Use Case: Chỉnh sửa các thuộc tính của một Note.
 */
export class EditExistingNote {
    private noteRepository: INoteRepository;
    private songRepository: ISongRepository; // Cần thiết để cập nhật Track

    constructor(noteRepository: INoteRepository, songRepository: ISongRepository) {
        this.noteRepository = noteRepository;
        this.songRepository = songRepository;
    }

    /**
     * Thực thi Use Case.
     * @param data Dữ liệu chứa ID, songId và các trường cần cập nhật.
     * @returns Promise trả về Note đã được cập nhật.
     * @throws Error nếu Note hoặc Song không tồn tại.
     */
    async execute(data: EditNoteData): Promise<Note> {
        // 1. Tải Song và Note để tìm kiếm và đảm bảo tính toàn vẹn dữ liệu
        const song = await this.songRepository.findById(data.songId);
        if (!song) {
            throw new Error(`Song with ID ${data.songId} not found.`);
        }

        const track = song.tracks.find(t => t.id === data.trackId); // Giả sử Note đã có trackId
        if (!track) {
            throw new Error(`Track not found in Song ${data.songId}.`);
        }

        // 2. Tải tất cả Notes cho Song (hoặc tìm kiếm Note đã lưu)
        const notes = await this.noteRepository.findBySongId(data.songId);
        const existingNote = notes.find(n => n.id === data.id);

        if (!existingNote) {
            throw new Error(`Note with ID ${data.id} not found in Song ${data.songId}.`);
        }

        // 3. Áp dụng các thay đổi
        Object.assign(existingNote, data); // Gán các thuộc tính từ DTO vào entity

        // 4. Lưu lại Note bằng Note Repository
        const updatedNote = await this.noteRepository.save(existingNote);

        // 5. Cập nhật Song/Track (quan trọng để giữ state UI đồng bộ, nếu Track chứa Notes)
        const trackIndex = song.tracks.findIndex(t => t.id === track.id);
        const noteIndex = song.tracks[trackIndex].notes.findIndex(n => n.id === updatedNote.id);
        if (noteIndex !== -1) {
            song.tracks[trackIndex].notes[noteIndex] = updatedNote;
            await this.songRepository.save(song); // Lưu lại Song đã cập nhật
        }

        return updatedNote;
    }
}
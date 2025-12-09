// src/application/note/AddNoteToTrack.ts

import { ISongRepository } from '../../domain/repositories/ISongRepository';
import { INoteRepository } from '../../domain/repositories/INoteRepository';
import { Note } from '../../domain/entities/Note';

// DTO (Data Transfer Object) đơn giản cho dữ liệu Note đầu vào
export interface NoteData {
    time: number;
    duration: number;
    pitch: number;
    velocity: number;
}

/**
 * Lớp Use Case: Thêm một Note mới vào Track của một Song cụ thể.
 * Lưu ý: Use Case này sử dụng nhiều Repository.
 */
export class AddNoteToSong {
    private songRepository: ISongRepository;
    private noteRepository: INoteRepository;

    constructor(songRepository: ISongRepository, noteRepository: INoteRepository) {
        this.songRepository = songRepository;
        this.noteRepository = noteRepository;
    }

    /**
     * Thực thi Use Case.
     * @param songId ID của Song chứa Track.
     * @param track Thứ tự của Track cần thêm Note.
     * @param data Dữ liệu cơ bản của Note mới.
     * @returns Promise trả về Note đã được lưu.
     */
    async execute(songId: string, trackId: string, data: NoteData): Promise<Note> {
        // 1. Tải Song hiện tại (Đảm bảo Song và Track tồn tại)
        const song = await this.songRepository.findById(songId);
        if (!song) {
            throw new Error(`Song with ID ${songId} not found.`);
        }

        const track = song.tracks.find(x => x.id === trackId);
        if (!track) {
            throw new Error(`Track with ID ${trackId} not found.`);
        }

        // 2. Tạo thực thể Note mới
        const newNote: Note = {
            songId: songId,
            trackId: trackId,
            time: data.time,
            title: 'New Note',
            description: 'default description',
            color: '#ffffff',
            icon: 'default icon'
        };

        // 3. Sử dụng Note Repository để lưu trữ Note (sinh ra ID)
        const savedNote = await this.noteRepository.save(newNote);


        // 4. Cập nhật Song: Thêm Note vào Track tương ứng
        track.notes.push(savedNote);

        // 5. Lưu lại Song đã cập nhật (tùy chọn, nếu bạn muốn lưu cả cấu trúc Song)
        await this.songRepository.save(song);

        return savedNote;
    }
}
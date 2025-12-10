// src/application/note/AddNoteToTrack.ts

import { ISongRepository } from '../../domain/repositories/ISongRepository';
import { INoteRepository } from '../../domain/repositories/INoteRepository';
import { Note } from '../../domain/entities/Note';

// DTO (Data Transfer Object) đơn giản cho dữ liệu Note đầu vào
export interface NoteData {
    songId: string;
    trackId: string;
    track: number;
    time: number;
    title: string;
    description: string;
    color: string;
    icon?: string;
}

/**
 * Lớp Use Case: Thêm một Note mới vào Track của một Song cụ thể.
 * Lưu ý: Use Case này sử dụng nhiều Repository.
 */
export class AddNoteToSong {
    private songRepository: ISongRepository;
    private noteRepository: INoteRepository;

    constructor(noteRepository: INoteRepository, songRepository: ISongRepository) {
        this.noteRepository = noteRepository;
        this.songRepository = songRepository;
    }

    /**
     * Thực thi Use Case.
     * @param songId ID của Song chứa Track.
     * @param track Thứ tự của Track cần thêm Note.
     * @param data Dữ liệu cơ bản của Note mới.
     * @returns Promise trả về Note đã được lưu.
     */
    async execute(data: NoteData): Promise<Note> {
        // 1. Tải Song hiện tại (Đảm bảo Song và Track tồn tại)
        const song = await this.songRepository.findById(data.songId);
        if (!song) {
            throw new Error(`Song with ID ${data.songId} not found.`);
        }

        const track = song.tracks[data.track];
        if (!track) {
            throw new Error(`Track with ID ${data.track} not found.`);
        }

        const time = track.notes.find(n => n.time === data.time);
        if (time) {
            throw new Error(`Note with Time ${data.time} is existing`);
        }

        // 2. Tạo thực thể Note mới
        const newNote: Note = {
            songId: data.songId,
            trackId: data.trackId,
            track: data.track,
            time: data.time,
            title: data.title,
            description: data.description,
            color: data.color,
            icon: data.icon
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
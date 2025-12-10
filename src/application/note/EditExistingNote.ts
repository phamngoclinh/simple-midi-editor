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
    track: number;
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

        if (notes.some(x => x.id !== data.id && x.time === data.time && x.trackId === data.trackId)) {
            throw new Error(`Note with Time ${data.time}, TrackId ${data.trackId} is existing in song`);
        }

        // 3. Áp dụng các thay đổi
        Object.assign(existingNote, data); // Gán các thuộc tính từ DTO vào entity

        // 4. Lưu lại Note bằng Note Repository
        const updatedNote = await this.noteRepository.save(existingNote);

        // 5. Cập nhật Song/Track (quan trọng để giữ state UI đồng bộ, nếu Track chứa Notes)
        let oldTrackId: string | undefined;
        let oldTrackIndex = -1;
        let noteIndex = -1;

        // Duyệt qua tất cả các tracks để tìm vị trí Note hiện tại
        for (let i = 0; i < song.tracks.length; i++) {
            const track = song.tracks[i];
            noteIndex = track.notes.findIndex(n => n.id === data.id);

            if (noteIndex !== -1) {
                oldTrackId = track.id;
                oldTrackIndex = i;
                break; // Đã tìm thấy vị trí cũ
            }
        }
        if (noteIndex === -1) {
            throw new Error(`Note với ID '${updatedNote.id}' không tồn tại trong Song.`);
        }

        const newTrackId = data.trackId;
        const newTrackIndex = song.tracks.findIndex(t => t.id === newTrackId);

        if (newTrackIndex === -1) {
            throw new Error(`Track mới với ID '${newTrackId}' không tồn tại.`);
        }

        if (oldTrackId !== newTrackId) {
            // A. Xóa Note khỏi Track cũ
            // Tạo bản sao của mảng notes để đảm bảo tính bất biến
            const oldTrackNotes = [...song.tracks[oldTrackIndex].notes];
            oldTrackNotes.splice(noteIndex, 1);

            // Cập nhật Song với Track cũ đã xóa Note
            song.tracks[oldTrackIndex] = {
                ...song.tracks[oldTrackIndex],
                notes: oldTrackNotes
            };

            // B. Thêm Note vào Track mới
            // Note đã được cập nhật (`updatedNote`) sẽ được thêm vào track mới
            const newTrackNotes = [...song.tracks[newTrackIndex].notes, updatedNote];

            // Cập nhật Song với Track mới đã thêm Note
            song.tracks[newTrackIndex] = {
                ...song.tracks[newTrackIndex],
                notes: newTrackNotes
            };
        } else {
            // --- 3. Xử lý Cập nhật Note trong cùng Track ---

            // Note vẫn nằm trong Track cũ (oldTrackId === newTrackId)

            // Tạo bản sao và cập nhật Note tại vị trí cũ
            const currentTrackNotes = [...song.tracks[oldTrackIndex].notes];
            currentTrackNotes[noteIndex] = updatedNote;

            // Cập nhật Song với Track đã chỉnh sửa Note
            song.tracks[oldTrackIndex] = {
                ...song.tracks[oldTrackIndex],
                notes: currentTrackNotes
            };
        }
        await this.songRepository.save(song); // Lưu lại Song đã cập nhật
        return updatedNote;
    }
}
// src/infrastructure/storage/LocalStorageSongRepository.ts

import { ISongRepository } from '../../domain/repositories/ISongRepository';
import { Song } from '../../domain/entities/Song';
import { v4 as uuidv4 } from 'uuid'; // Giả sử dùng uuid để tạo ID

const SONG_STORAGE_KEY = 'MIDI_EDITOR_SONGS';

export class LocalStorageSongRepository implements ISongRepository {
    private getSongsFromStorage(): Song[] {
        const json = localStorage.getItem(SONG_STORAGE_KEY);
        // Xử lý deserialization và trả về mảng Song
        return json ? (JSON.parse(json) as Song[]) : [];
    }

    private saveSongsToStorage(songs: Song[]): void {
        // Xử lý serialization và lưu vào localStorage
        localStorage.setItem(SONG_STORAGE_KEY, JSON.stringify(songs));
    }

    // --- Implementations từ ISongRepository ---

    async save(song: Song): Promise<Song> {
        const songs = this.getSongsFromStorage();
        const now = new Date().toISOString();

        if (song.id) {
            // Cập nhật Song hiện có
            const index = songs.findIndex(s => s.id === song.id);
            if (index !== -1) {
                songs[index] = { ...song, updatedTimestamp: now };
            }
            // Nếu không tìm thấy, coi như tạo mới (tùy thuộc quy tắc nghiệp vụ)
        } else {
            // Tạo Song mới
            song.id = uuidv4();
            song.createdTimestamp = now;
            song.updatedTimestamp = now;
            songs.push(song);
        }

        this.saveSongsToStorage(songs);
        return song;
    }

    async findById(id: string): Promise<Song | null> {
        const songs = this.getSongsFromStorage();
        return songs.find(song => song.id === id) || null;
    }

    async findAll(): Promise<Song[]> {
        return this.getSongsFromStorage();
    }

    async deleteById(id: string): Promise<void> {
        let songs = this.getSongsFromStorage();
        songs = songs.filter(song => song.id !== id);
        this.saveSongsToStorage(songs);
        // Thường sau khi xóa Song, cần xóa cả Notes liên quan (DIP/Use Case sẽ xử lý)
    }
}
// src/infrastructure/storage/LocalStorageNoteRepository.ts

import { INoteRepository } from '../../domain/repositories/INoteRepository';
import { Note } from '../../domain/entities/Note';
import { v4 as uuidv4 } from 'uuid';
import { MIDI_EDITOR_NOTES_SONG } from '../config/localStorageKeys';

// Hàm helper để tạo key cho từng Song
const getNoteStorageKey = (songId: string) => MIDI_EDITOR_NOTES_SONG.replace('{{songId}}', songId);

export class LocalStorageNoteRepository implements INoteRepository {
    private getNotesForSong(songId: string): Note[] {
        const key = getNoteStorageKey(songId);
        const json = localStorage.getItem(key);
        return json ? (JSON.parse(json) as Note[]) : [];
    }

    private saveNotesForSong(songId: string, notes: Note[]): void {
        const key = getNoteStorageKey(songId);
        localStorage.setItem(key, JSON.stringify(notes));
    }

    // --- Implementations từ INoteRepository ---

    async save(note: Note): Promise<Note> {
        if (!note.songId) throw new Error("Note must have a songId.");

        const notes = this.getNotesForSong(note.songId);

        if (note.id) {
            // Cập nhật Note hiện có
            const index = notes.findIndex(n => n.id === note.id);
            if (index !== -1) {
                notes[index] = note;
            }
        } else {
            // Thêm Note mới
            note.id = uuidv4();
            notes.push(note);
        }

        this.saveNotesForSong(note.songId, notes);
        return note;
    }

    async findBySongId(songId: string): Promise<Note[]> {
        return this.getNotesForSong(songId);
    }

    async deleteById(id: string, songId: string): Promise<void> {
        let notes = this.getNotesForSong(songId);
        notes = notes.filter(note => note.id !== id);
        this.saveNotesForSong(songId, notes);
    }

    async deleteAllBySongId(songId: string): Promise<void> {
        const key = getNoteStorageKey(songId);
        localStorage.removeItem(key);
    }
}
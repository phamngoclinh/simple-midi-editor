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
    return this.noteRepository.create(data.songId, data.trackId, {
      time: data.time,
      title: data.title,
      description: data.description,
      color: data.color,
      icon: data.icon
    });
  }
}
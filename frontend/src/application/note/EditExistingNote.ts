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
    return this.noteRepository.update(data.id, data);
  }
}
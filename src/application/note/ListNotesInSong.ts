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
    return this.noteRepository.findBySongId(songId);
  }
}
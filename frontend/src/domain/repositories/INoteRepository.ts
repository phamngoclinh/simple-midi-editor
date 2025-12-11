// src/domain/repositories/INoteRepository.ts

import { Note } from '../entities/Note'; // Giả sử đã định nghĩa

/**
 * Interface Repository cho thực thể Note.
 */
export interface INoteRepository {
  create(songId: string, trackId: string, note: Omit<Note, 'id' | 'track'>): Promise<Note>;

  update(id: string, note: Partial<Omit<Note, 'id' | 'track'>>): Promise<Note>;

  findBySongId(songId: string): Promise<Note[]>;

  deleteById(id: string, songId: string): Promise<void>;
}
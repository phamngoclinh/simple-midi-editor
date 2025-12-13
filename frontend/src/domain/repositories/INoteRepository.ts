import { Note } from '../entities/Note'; // Giả sử đã định nghĩa

export interface INoteRepository {
  create(songId: string, trackId: string, note: Omit<Note, 'id' | 'track'>): Promise<Note>;

  update(id: string, note: Partial<Omit<Note, 'id' | 'track'>>): Promise<Note>;

  findBySongId(songId: string): Promise<Note[]>;

  deleteById(id: string): Promise<void>;
}
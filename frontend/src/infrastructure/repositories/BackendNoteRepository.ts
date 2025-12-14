import { INoteRepository } from '../../domain/repositories/INoteRepository';
import { Note } from '../../domain/entities/Note';
import { createNote, deleteNote, findNotesBySong, updateNote } from '../services/api';
import { NoteMapper } from '../mapper/mapper';
import { Track } from '../types/api';

export class BackendNoteRepository implements INoteRepository {
  async create(songId: string, trackId: string, note: Omit<Note, 'id' | 'track'>): Promise<Note> {
    const response = await createNote(songId, trackId, { ...note, track: { id: trackId } as Track });
    return NoteMapper.toDomain(response);
  }

  async update(id: string, note: Partial<Omit<Note, 'id' | 'track'>>): Promise<Note> {
    const response = await updateNote(id, note);
    return NoteMapper.toDomain(response);
  }

  async findBySongId(songId: string): Promise<Note[]> {
    const response = await findNotesBySong(songId);
    return response.map(NoteMapper.toDomain);
  }

  async deleteById(id: string): Promise<void> {
    await deleteNote(id);
  }
}
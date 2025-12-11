import { DeepPartial } from 'typeorm';
import { Note } from '../entities/note.entity';

export abstract class INoteRepository {
  abstract mergeNote(note: Note, update: DeepPartial<Note>): Note;
  abstract createNote(data: Note): Note;
  abstract saveNote(data: Note): Promise<Note>;
  abstract findNoteById(id: string): Promise<Note | null>;
  abstract findAllNote(): Promise<Note[]>;
  abstract findAllNoteBySongId(songId: string): Promise<Note[]>;
  abstract findAllNoteByTrackId(trackId: string): Promise<Note[]>;
  abstract deleteNote(id: string): Promise<{ affected?: number | null }>;
  abstract findNoteByTimeNTrackId(
    time: number,
    trackId: string,
  ): Promise<Note | null>;
}

import { INoteRepository } from '../../domain/repositories/INoteRepository';
import { Note } from '../../domain/entities/Note';

export interface EditNoteData {
  id: string;
  songId: string;
  trackId: string;
  track: number;
  time?: number;
  title?: string;
  description?: string;
  color?: string;
  icon?: string;
}

export class EditExistingNote {
  private noteRepository: INoteRepository;

  constructor(noteRepository: INoteRepository) {
    this.noteRepository = noteRepository;
  }

  async execute(data: EditNoteData): Promise<Note> {
    return this.noteRepository.update(data.id, data);
  }
}
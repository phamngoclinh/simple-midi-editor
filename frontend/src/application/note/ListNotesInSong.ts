import { INoteRepository } from '../../domain/repositories/INoteRepository';
import { Note } from '../../domain/entities/Note';

export class ListNotesInSong {
  private noteRepository: INoteRepository;

  constructor(noteRepository: INoteRepository) {
    this.noteRepository = noteRepository;
  }

  async execute(songId: string): Promise<Note[]> {
    return this.noteRepository.findBySongId(songId);
  }
}
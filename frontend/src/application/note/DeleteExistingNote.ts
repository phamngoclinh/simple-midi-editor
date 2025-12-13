import { INoteRepository } from '../../domain/repositories/INoteRepository';

export class DeleteExistingNote {
  private noteRepository: INoteRepository;

  constructor(noteRepository: INoteRepository) {
    this.noteRepository = noteRepository;
  }

  async execute(noteId: string): Promise<void> {
    await this.noteRepository.deleteById(noteId);
  }
}
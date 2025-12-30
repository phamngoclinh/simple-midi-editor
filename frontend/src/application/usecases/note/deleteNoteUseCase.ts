import NoteRepository from '../../../domain/note/noteRepository';
import { Id } from '../../../domain/shared/types';
import BaseUseCase from '../baseUseCase';

class DeleteNoteUseCase extends BaseUseCase<Id, boolean> {
  private noteRepository: NoteRepository;

  constructor(noteRepository: NoteRepository) {
    super();

    this.noteRepository = noteRepository;
  }

  handle(noteId: Id) {
    return this.noteRepository.deleteById(noteId);
  }
}

export default DeleteNoteUseCase;

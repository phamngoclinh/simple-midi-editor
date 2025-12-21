import NoteEntity from '../../../domain/note/noteEntity';
import NoteRepository from '../../../domain/note/noteRepository';
import BaseUseCase from '../baseUseCase';
import generateId from '../common/generateId';

class CreateNoteUseCase extends BaseUseCase<Omit<NoteEntity, 'id'>, NoteEntity> {
  private noteRepository: NoteRepository;

  constructor(noteRepository: NoteRepository) {
    super();

    this.noteRepository = noteRepository;
  }

  handle(data: Omit<NoteEntity, 'id'>) {
    const note = {
      ...data,
      id: generateId('note'),
    };
    return this.noteRepository.create(note);
  }
}

export default CreateNoteUseCase;
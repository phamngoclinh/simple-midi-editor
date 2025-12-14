import { DomainException } from './domain.exception';

export class NoteNotFoundException extends DomainException {
  constructor({ id }: { id: string }) {
    super(`Note with ID "${id}" not found`, 'NOTE_NOT_FOUND');
  }
}

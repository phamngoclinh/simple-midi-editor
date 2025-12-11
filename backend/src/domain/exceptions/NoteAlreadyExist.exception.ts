import { DomainException } from './domain.exception';

export class NoteAlreadyExistException extends DomainException {
  constructor(message: string) {
    super(message, 'NOTE_ALREADY_EXIST');
  }
}

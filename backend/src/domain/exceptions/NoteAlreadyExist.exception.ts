import { DomainException } from './domain.exception';

export class NoteAlreadyExistException extends DomainException {
  constructor({ trackId, time }: { trackId: string; time: number }) {
    super(
      `Note already exists on Track ID "${trackId}" at time position "${time}".`,
      'NOTE_ALREADY_EXIST',
    );
  }
}

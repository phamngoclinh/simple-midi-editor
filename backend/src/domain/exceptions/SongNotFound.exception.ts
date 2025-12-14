import { DomainException } from './domain.exception';

export class SongNotFoundException extends DomainException {
  constructor({ id }: { id: string }) {
    super(`Song with ID "${id}" not found`, 'SONG_NOT_FOUND');
  }
}

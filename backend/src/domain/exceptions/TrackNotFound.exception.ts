import { DomainException } from './domain.exception';

export class TrackNotFoundException extends DomainException {
  constructor({ id }: { id: string }) {
    super(`Track with ID "${id}" not found`, 'TRACK_NOT_FOUND');
  }
}

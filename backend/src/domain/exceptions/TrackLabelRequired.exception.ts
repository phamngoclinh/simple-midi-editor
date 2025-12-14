import { DomainException } from './domain.exception';

export class TrackLabelRequiredException extends DomainException {
  constructor() {
    super(`Track label is required`, 'TRACK_LABEL_IS_REQUIRED');
  }
}

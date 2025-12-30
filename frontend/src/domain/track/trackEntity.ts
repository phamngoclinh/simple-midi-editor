import { Id } from '../shared/types';

interface TrackEntity {
  id: Id;

  order: number;

  label: string;

  instrument?: string;

  songId: Id;
}

export default TrackEntity;

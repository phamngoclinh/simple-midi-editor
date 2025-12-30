import { Id, Tag } from '../shared/types';
import TrackEntity from './trackEntity';

interface SongAggregate {
  id: Id;

  name: string;

  description?: string;

  totalDuration: number;

  tags: Tag[];

  createdTimestamp: string;

  updatedTimestamp: string;

  tracks: TrackEntity[];
}

export default SongAggregate;

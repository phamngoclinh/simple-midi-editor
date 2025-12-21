import { Id, Tag } from '../shared/types';

interface SongEntity {

  id: Id;

  name: string;

  description?: string;

  totalDuration: number;

  tags: Tag[];

  createdTimestamp: string;

  updatedTimestamp: string;

}

export default SongEntity;
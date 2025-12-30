import { Id } from '../shared/types';
import SongEntity from './songEntity';

interface SongRepository {
  save(song: SongEntity): Promise<SongEntity>;

  findById(id: Id): Promise<SongEntity | null>;

  findAll(): Promise<SongEntity[]>;

  deleteById(id: Id): Promise<boolean>;
}

export default SongRepository;

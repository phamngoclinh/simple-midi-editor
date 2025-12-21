import { Id } from '../shared/types';
import TrackEntity from './trackEntity';

interface TrackRepository {

  save(track: TrackEntity): Promise<TrackEntity>;

  findById(id: Id): Promise<TrackEntity | null>;

  deleteById(id: Id): Promise<boolean>;

  findBySongId(songId: Id): Promise<TrackEntity[]>;

}

export default TrackRepository;

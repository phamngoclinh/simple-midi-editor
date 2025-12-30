import { Id } from '../../domain/shared/types';
import TrackEntity from '../../domain/track/trackEntity';
import TrackRepository from '../../domain/track/trackRepository';

export class TrackRepositoryImpl implements TrackRepository {
  async save(track: TrackEntity): Promise<TrackEntity> {
    throw new Error('Method not implemented.');
  }

  findById(id: Id): Promise<TrackEntity | null> {
    throw new Error('Method not implemented.');
  }

  deleteById(id: Id): Promise<boolean> {
    throw new Error('Method not implemented.');
  }

  async findBySongId(songId: Id): Promise<TrackEntity[]> {
    throw new Error('Method not implemented.');
  }
}

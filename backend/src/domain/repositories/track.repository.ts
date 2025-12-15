import { Track } from '../entities/track.entity';

export abstract class ITrackRepository {
  abstract createTrack(data: Track): Track;
  abstract findTrackById(id: string): Promise<Track | null>;
  abstract saveTrack(data: Track): Promise<Track>;
  abstract deleteTracks(ids: string[]): Promise<{ affected?: number | null }>;
}

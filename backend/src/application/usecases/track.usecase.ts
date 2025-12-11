/**
 * Application Layer - Get Delivery Stats Use Case
 * Retrieves delivery statistics for a given time period
 */

import { ITrackRepository } from 'src/domain/repositories/track.repository';
import { Track } from 'src/domain/entities/track.entity';

export class TracksUseCase {
  constructor(private readonly tracksRepository: ITrackRepository) { }

  async updateLabel(trackId: string, newLabel: string): Promise<Track> {
    const track = await this.tracksRepository.findTrackById(trackId);

    if (!track) {
      throw new Error(`Track with ID "${trackId}" not found`);
    }

    track.label = newLabel;

    // Lưu và trả về Track đã cập nhật
    return this.tracksRepository.saveTrack(track);
  }
}

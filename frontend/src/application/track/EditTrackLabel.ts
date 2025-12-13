import { ISongRepository } from '../../domain/repositories/ISongRepository';
import { Track } from '../../domain/entities/Track';

export interface EditTrackLabelData {
  songId: string;
  trackId: string;
  newLabel: string;
}

export class EditTrackLabelUseCase {
  private songRepository: ISongRepository;

  constructor(songRepository: ISongRepository) {
    this.songRepository = songRepository;
  }

  async execute(data: EditTrackLabelData): Promise<Track> {
    const { songId, trackId, newLabel } = data;

    if (!songId || !trackId || !newLabel.trim()) {
      throw new Error("Dữ liệu đầu vào (songId, trackId, newLabel) không hợp lệ.");
    }

    const trimmedLabel = newLabel.trim();

    return this.songRepository.updateTrackLabel(songId, trackId, trimmedLabel);
  }
}
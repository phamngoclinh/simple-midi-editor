import { ISongRepository } from '../../domain/repositories/ISongRepository';
import { Song } from '../../domain/entities/Song';

export class LoadSongById {
  private songRepository: ISongRepository;

  constructor(songRepository: ISongRepository) {
    this.songRepository = songRepository;
  }

  async execute(songId: string): Promise<Song> {
    const song = await this.songRepository.findById(songId);

    if (!song) {
      throw new Error(`Song with ID "${songId}" not found.`);
    }

    return song;
  }
}
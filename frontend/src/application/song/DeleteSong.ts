import { ISongRepository } from '../../domain/repositories/ISongRepository';

export class DeleteSong {
  private songRepository: ISongRepository;

  constructor(songRepository: ISongRepository) {
    this.songRepository = songRepository;
  }

  async execute(songId: string): Promise<void> {
    return this.songRepository.deleteById(songId);
  }
}
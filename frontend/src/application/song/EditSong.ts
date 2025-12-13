import { ISongRepository } from '../../domain/repositories/ISongRepository';
import { Song } from '../../domain/entities/Song';

export class EditSong {
  private songRepository: ISongRepository;

  constructor(songRepository: ISongRepository) {
    this.songRepository = songRepository;
  }

  async execute(data: Partial<Song> & Required<Pick<Song, 'id'>>): Promise<Song> {
    return this.songRepository.update(data);
  }
}
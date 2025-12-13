import { ISongRepository } from '../../domain/repositories/ISongRepository';
import { Song } from '../../domain/entities/Song';

export type SongSortBy = 'name' | 'updated' | 'created' | 'totalDuration';
export type SortOrder = 'asc' | 'desc';

export class ListAllSongs {
  private songRepository: ISongRepository;

  constructor(songRepository: ISongRepository) {
    this.songRepository = songRepository;
  }

  async execute(sortBy: SongSortBy = 'updated', order: SortOrder = 'desc'): Promise<Song[]> {
    const songs = await this.songRepository.findAll();

    const direction = order === 'asc' ? 1 : -1;

    songs.sort((a, b) => {
      let aValue: any;
      let bValue: any;

      switch (sortBy) {
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case 'created':
          aValue = new Date(a.createdTimestamp || 0).getTime();
          bValue = new Date(b.createdTimestamp || 0).getTime();
          break;
        case 'totalDuration':
          aValue = a.totalDuration;
          bValue = b.totalDuration;
          break;
        case 'updated':
        default:
          aValue = new Date(a.updatedTimestamp || 0).getTime();
          bValue = new Date(b.updatedTimestamp || 0).getTime();
          break;
      }

      if (aValue < bValue) return -1 * direction;
      if (aValue > bValue) return 1 * direction;
      return 0;
    });
    return songs;
  }
}
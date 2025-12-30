import SongAggregate from '../../../domain/songAggregate/songAggregate';
import SongAggregateRepository from '../../../domain/songAggregate/songAggregateRepository';
import BaseUseCase from '../baseUseCase';

export type SongSortBy = 'name' | 'updated' | 'created' | 'totalDuration';
export type SortOrder = 'asc' | 'desc';

export interface ListAllSongsInput {
  sortBy: SongSortBy;
  order: SortOrder;
}

class ListAllSongsUseCase extends BaseUseCase<ListAllSongsInput, SongAggregate[]> {
  private songAggregateRepository: SongAggregateRepository;

  constructor(songAggregateRepository: SongAggregateRepository) {
    super();

    this.songAggregateRepository = songAggregateRepository;
  }

  async handle(data: ListAllSongsInput = { sortBy: 'updated', order: 'desc' }) {
    const songs = await this.songAggregateRepository.findAll();

    const direction = data.order === 'asc' ? 1 : -1;

    songs.sort((a, b) => {
      let aValue: any;
      let bValue: any;

      switch (data.sortBy) {
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

export default ListAllSongsUseCase;

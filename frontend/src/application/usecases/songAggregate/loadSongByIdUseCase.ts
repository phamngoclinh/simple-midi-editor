import { Id } from '../../../domain/shared/types';
import SongAggregate from '../../../domain/songAggregate/songAggregate';
import SongAggregateRepository from '../../../domain/songAggregate/songAggregateRepository';
import BaseUseCase from '../baseUseCase';

class LoadSongByIdUseCase extends BaseUseCase<Id, SongAggregate> {
  private songAggregateRepository: SongAggregateRepository;

  constructor(songAggregateRepository: SongAggregateRepository) {
    super();

    this.songAggregateRepository = songAggregateRepository;
  }

  handle(songId: Id) {
    return this.songAggregateRepository.findById(songId);
  }
}

export default LoadSongByIdUseCase;

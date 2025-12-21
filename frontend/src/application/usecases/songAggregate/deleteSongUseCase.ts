import { Id } from '../../../domain/shared/types';
import SongAggregateRepository from '../../../domain/songAggregate/songAggregateRepository';
import BaseUseCase from '../baseUseCase';

class DeleteSongUseCase extends BaseUseCase<Id, boolean> {

  private songRepository: SongAggregateRepository;

  constructor(songRepository: SongAggregateRepository) {
    super();

    this.songRepository = songRepository;
  }

  handle(songId: Id) {
    return this.songRepository.deleteById(songId);
  }

}

export default DeleteSongUseCase;
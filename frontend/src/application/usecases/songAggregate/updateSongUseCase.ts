import SongAggregate from '../../../domain/songAggregate/songAggregate';
import SongAggregateRepository from '../../../domain/songAggregate/songAggregateRepository';
import BaseUseCase from '../baseUseCase';
import { UpdateSongInput } from './dto/updateSongInput';


class UpdateSongUseCase extends BaseUseCase<UpdateSongInput, SongAggregate> {
  private songAggregateRepository: SongAggregateRepository;

  constructor(songAggregateRepository: SongAggregateRepository) {
    super();

    this.songAggregateRepository = songAggregateRepository;
  }

  async handle(song: UpdateSongInput) {
    return this.songAggregateRepository.update(song);
  }
}

export default UpdateSongUseCase;
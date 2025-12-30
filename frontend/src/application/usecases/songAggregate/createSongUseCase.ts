import SongAggregate from '../../../domain/songAggregate/songAggregate';
import SongAggregateRepository from '../../../domain/songAggregate/songAggregateRepository';
import ValidationException from '../../exceptions/ValidationException';
import { validateSongName, validateSongTotalDuration } from '../../validators/songValidator';
import { runValidators } from '../../validators/validatorRunner';
import BaseUseCase from '../baseUseCase';
import generateId from '../common/generateId';
import { CreateSongInput } from './dto/createSongInput';

class CreateSongUseCase extends BaseUseCase<CreateSongInput, SongAggregate> {
  private songAggregateRepository: SongAggregateRepository;

  constructor(songAggregateRepository: SongAggregateRepository) {
    super();

    this.songAggregateRepository = songAggregateRepository;
  }

  async handle(song: CreateSongInput) {
    const errors = runValidators([
      { field: 'name', error: validateSongName(song.name) },
      { field: 'totalDuration', error: validateSongTotalDuration(song.totalDuration) },
    ]);

    if (Object.keys(errors).length > 0) {
      throw new ValidationException('Dữ liệu bài hát không hợp lệ.', errors);
    }

    const songAggregate = {
      ...song,
      id: generateId('song'),
      createdTimestamp: `${Date.now()}`,
      updatedTimestamp: `${Date.now()}`,
      tracks: song.tracks.map(t => ({
        ...t,
        id: generateId('track'),
        notes: t.notes.map(n => ({
          ...n,
          id: generateId('note'),
        })),
      })),
    };

    return this.songAggregateRepository.create(songAggregate);
  }
}

export default CreateSongUseCase;

import SongAggregate from '../../../domain/songAggregate/songAggregate';
import SongAggregateRepository from '../../../domain/songAggregate/songAggregateRepository';
import BaseUseCase from '../baseUseCase';
import generateId from '../common/generateId';
import SongDocument from './dto/songDocument';

class ImportSongUseCase extends BaseUseCase<SongDocument, SongAggregate> {

  private songAggregateRepository: SongAggregateRepository;

  constructor(songAggregateRepository: SongAggregateRepository) {
    super();

    this.songAggregateRepository = songAggregateRepository;
  }

  async handle(importData: SongDocument) {

    const songAggregate: SongAggregate = {
      id: generateId('song'),
      name: importData.name,
      description: importData.description,
      totalDuration: importData.totalDuration,
      tags: importData.tags || [],
      tracks: importData.trackLabels.map((label, trackIdx) => ({
        id: generateId('track'),
        label,
        order: trackIdx + 1,
        instrument: 'Instrument ' + trackIdx + 1,
        notes: importData.notes
          .filter(n => n.track === trackIdx + 1)
          .map(note => ({
            id: generateId('note'),
            time: note.time,
            title: note.title,
            description: note.description,
            color: note.color,
            icon: note.icon,
          })),
      })),
      createdTimestamp: `${Date.now()}`,
      updatedTimestamp: `${Date.now()}`,
    };

    const result = await this.songAggregateRepository.create(songAggregate);

    return result;
  }

}

export default ImportSongUseCase;
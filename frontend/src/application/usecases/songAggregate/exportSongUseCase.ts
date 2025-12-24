import { Id } from '../../../domain/shared/types';
import SongAggregate from '../../../domain/songAggregate/songAggregate';
import SongAggregateRepository from '../../../domain/songAggregate/songAggregateRepository';
import BaseUseCase from '../baseUseCase';
import SongDocument from './dto/songDocument';
import { songAggregateMapper } from './mapper/songAggregateMapper';

class ExportSongUseCase extends BaseUseCase<Id, SongDocument, SongAggregate> {

  private songAggregateRepository: SongAggregateRepository;

  constructor(songAggregateRepository: SongAggregateRepository) {
    super();

    this.songAggregateRepository = songAggregateRepository;
  }

  // handle(songId: Id) {
  //   return this.songAggregateRepository.findById(songId);
  // }

  async handle(id: Id, song: SongAggregate) {
    const response = await this.songAggregateRepository.findById(id);

    if (!response) {
      if (song) {
        return songAggregateMapper.toSongDocument(song);
      }

      throw new Error(`SongID = ${id} không hợp lệ`);
    }

    return songAggregateMapper.toSongDocument(response);

    // const exportNotes: SongAggregate['notes'] = [];

    // Object.values(song.tracks).forEach((track, index) => {
    //   Object.values(track.notes || {}).forEach(note => {
    //     exportNotes.push({
    //       track: index + 1,
    //       time: note.time,
    //       title: note.title,
    //       description: note.description,
    //       color: note.color,
    //       icon: note.icon
    //     });
    //   });
    // });

    // const exportData: ExportSongEntity = {
    //   name: song.name,
    //   description: song.description,
    //   totalDuration: song.totalDuration || 60,
    //   trackLabels: Object.values(song.tracks).map(t => t.label),
    //   notes: exportNotes,
    //   tags: Object.values(song.tags)
    // };

    // return exportData;

    // throw new Error('This function is not implemented');

  }

}

export default ExportSongUseCase;
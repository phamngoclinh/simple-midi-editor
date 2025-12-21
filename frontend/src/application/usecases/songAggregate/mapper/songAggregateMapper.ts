import SongAggregate from '../../../../domain/songAggregate/songAggregate';
import SongDocument from '../dto/songDocument';

export const songAggregateMapper = {
  toSongDocument: (songAggregate: SongAggregate) => {
    const tracks = songAggregate.tracks.sort((a, b) => a.order - b.order);
    const notes: SongDocument['notes'] = [];

    songAggregate.tracks.forEach((track, index) => {
      track.notes.forEach((note) => {
        notes.push({
          track: index + 1,
          time: note.time,
          title: note.title,
          description: note.description,
          color: note.color,
          icon: note.icon,
        })
      });
    });

    const result: SongDocument = {
      name: songAggregate.name,
      description: songAggregate.description,
      totalDuration: songAggregate.totalDuration,
      tags: songAggregate.tags,
      trackLabels: tracks.map(t => t.label),
      notes,
    };

    return result;
  },

}
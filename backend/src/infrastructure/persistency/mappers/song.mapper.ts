import { Song } from '../../../domain/entities/song.entity';
import { NoteEntity } from '../entities/note.entity';
import { SongEntity } from '../entities/song.entity';
import { TrackEntity } from '../entities/track.entity';

export class SongMapper {
  /**
   * Convert domain entity to persistence entity
   */
  static toPersistence(domain: Song): SongEntity {
    const entity = new SongEntity();
    if (domain.id !== undefined) entity.id = domain.id;
    entity.name = domain.name;
    if (domain.description !== undefined) entity.description = domain.description;
    entity.totalDuration = domain.totalDuration;
    if (domain.tags !== undefined) entity.tags = domain.tags;
    entity.tracks = domain.tracks.map(track => {
      const t = new TrackEntity();
      t.id = track.id;
      t.label = track.label;
      t.order = track.order;
      t.instrument = track.instrument;
      t.notes = track.notes?.map(note => {
        const n = new NoteEntity();
        n.id = note.id;
        n.time = note.time;
        n.title = note.title;
        if (note.description !== undefined) n.description = note.description;
        n.color = note.color;
        if (note.icon !== undefined) n.icon = note.icon;
        return n;
      });
      return t;
    });
    return entity;
  }

  /**
   * Convert persistence entity to domain entity
   */
  static toDomain(persistence: SongEntity): Song {
    const song = new Song();

    song.id = persistence.id;
    song.name = persistence.name;
    song.description = persistence.description;
    song.totalDuration = persistence.totalDuration;
    song.tags = persistence.tags;
    song.tracks = persistence.tracks.map(track => {
      return {
        id: track.id,
        song: track.song,
        label: track.label,
        order: track.order,
        instrument: track.instrument,
        notes: track.notes,
      };
    });
    song.createdTimestamp = persistence.createdTimestamp;
    song.updatedTimestamp = persistence.updatedTimestamp;

    return song;
  }
}

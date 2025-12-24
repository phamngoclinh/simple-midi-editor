import { Track } from '../../../domain/entities/track.entity';
import { NoteEntity } from '../entities/note.entity';
import { TrackEntity } from '../entities/track.entity';

export class TrackMapper {
  /**
   * Convert domain entity to persistence entity
   */
  static toPersistence(domain: Track): TrackEntity {
    const entity = new TrackEntity();
    if (domain.id !== undefined) entity.id = domain.id;
    entity.label = domain.label;
    entity.order = domain.order;
    entity.instrument = domain.instrument;
    entity.notes = domain.notes?.map(note => {
      const entity = new NoteEntity();
      entity.id = note.id;
      if (note.time !== undefined) entity.time = note.time;
      entity.title = note.title;
      if (note.description !== undefined) entity.description = note.description;
      entity.color = note.color;
      if (note.icon !== undefined) entity.icon = note.icon;
      return entity;
    });
    return entity;
  }

  /**
   * Convert persistence entity to domain entity
   */
  static toDomain(persistence: TrackEntity): Track {
    const track = new Track();

    track.id = persistence.id;
    track.song = persistence.song;
    track.label = persistence.label;
    track.order = persistence.order;
    track.instrument = persistence.instrument;
    track.notes = persistence.notes;

    return track;
  }
}

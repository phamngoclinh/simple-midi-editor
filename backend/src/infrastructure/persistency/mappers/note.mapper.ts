import { Note } from '../../../domain/entities/note.entity';
import { NoteEntity } from '../entities/note.entity';
import { TrackEntity } from '../entities/track.entity';

export class NoteMapper {
  /**
   * Convert domain entity to persistence entity
   */
  static toPersistence(domain: Note): NoteEntity {
    const entity = new NoteEntity();
    if (domain.id) entity.id = domain.id;
    entity.time = domain.time;
    entity.title = domain.title;
    entity.color = domain.color;
    if (domain.description) entity.description = domain.description;
    if (domain.icon) entity.icon = domain.icon;
    if (domain.track) entity.track = { id: domain.track.id } as TrackEntity;
    return entity;
  }

  /**
   * Convert persistence entity to domain entity
   */
  static toDomain(persistence: NoteEntity): Note {
    const note = new Note();

    note.id = persistence.id;
    note.time = persistence.time;
    note.title = persistence.title;
    note.description = persistence.description;
    note.color = persistence.color;
    note.icon = persistence.icon;
    note.track = persistence.track;

    return note;
  }
}

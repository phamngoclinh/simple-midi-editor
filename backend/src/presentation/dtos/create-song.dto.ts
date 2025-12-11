import { Note } from 'src/domain/entities/note.entity';
import { Song } from 'src/domain/entities/song.entity';
import { Track } from 'src/domain/entities/track.entity';

export class NoteDto {
  time: number;
  title: string;
  description?: string;
  color: string;
  icon?: string;
}

export class TrackDto {
  label: string;
  order: number;
  instrument: string;
  notes?: NoteDto[];
}

export class CreateSongDto {
  name: string;
  description?: string;
  totalDuration: number;
  tags?: string[];
  tracks?: TrackDto[]; // Tracks sẽ được tạo cùng Song

  static toDomain(dto: CreateSongDto) {
    const domain = new Song();
    domain.name = dto.name;
    domain.description = dto.description;
    domain.totalDuration = dto.totalDuration;
    domain.tags = dto.tags;
    domain.tracks =
      dto.tracks?.map((track) => {
        const t = new Track();
        t.label = track.label;
        t.order = track.order;
        t.instrument = track.instrument;
        t.notes =
          track.notes?.map((note) => {
            const n = new Note();
            n.time = note.time;
            n.title = note.title;
            n.description = note.description;
            n.color = note.color;
            n.icon = note.icon;
            return n;
          }) || [];
        return t;
      }) || [];
    return domain;
  }
}

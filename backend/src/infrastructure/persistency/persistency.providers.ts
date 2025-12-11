import { ISongRepository } from 'src/domain/repositories/song.repository';
import { SongRepositoryImpl } from './repositories/song.repository.impl';
import { INoteRepository } from 'src/domain/repositories/note.repository';
import { NoteRepositoryImpl } from './repositories/note.repository.impl';
import { ITrackRepository } from 'src/domain/repositories/track.repository';
import { TrackRepositoryImpl } from './repositories/track.repository.impl';

export const persistencyProviders = [
  {
    provide: ISongRepository,
    useClass: SongRepositoryImpl,
  },
  {
    provide: ITrackRepository,
    useClass: TrackRepositoryImpl,
  },
  {
    provide: INoteRepository,
    useClass: NoteRepositoryImpl,
  },
];

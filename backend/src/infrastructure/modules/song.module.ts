/**
 * Application Layer - Use Cases Module
 * Provides all application use cases with proper DI wiring
 */

import { Module } from '@nestjs/common';
import { SongsUseCase } from 'src/application/usecases/song.usecase';
import { ISongRepository } from 'src/domain/repositories/song.repository';
import { ITrackRepository } from 'src/domain/repositories/track.repository';
import { SongController } from 'src/presentation/controllers/song.controller';
import { PersistencyModule } from '../persistency/persistency.module';
import { TracksUseCase } from 'src/application/usecases/track.usecase';
import { NotesUseCase } from 'src/application/usecases/note.usecase';
import { INoteRepository } from 'src/domain/repositories/note.repository';

@Module({
  imports: [PersistencyModule],
  controllers: [SongController],
  providers: [
    {
      provide: SongsUseCase,
      inject: [ISongRepository, ITrackRepository],
      useFactory: (songRepository: ISongRepository, trackReposity: ITrackRepository) =>
        new SongsUseCase(songRepository, trackReposity),
    },
    {
      provide: TracksUseCase,
      inject: [ITrackRepository],
      useFactory: (trackReposity: ITrackRepository) => new TracksUseCase(trackReposity),
    },
    {
      provide: NotesUseCase,
      inject: [INoteRepository, ITrackRepository],
      useFactory: (noteReposity: INoteRepository, trackReposity: ITrackRepository) =>
        new NotesUseCase(noteReposity, trackReposity),
    },
  ],
  exports: [SongsUseCase, TracksUseCase, NotesUseCase],
})
export class SongModule { }
